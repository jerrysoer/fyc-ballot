"use client";

import { useState, useEffect, useCallback } from "react";
import { categories, TOTAL_CATEGORIES } from "@/data/nominees";
import { Trophy, Undo2, Lock } from "lucide-react";
import { apiUrl } from "@/lib/api";

export default function WinnerMarker() {
  const [winners, setWinners] = useState<Record<string, string>>({});
  const [credentials, setCredentials] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState<string | null>(null);

  const fetchWinners = useCallback(async () => {
    try {
      const res = await fetch(apiUrl("/api/admin/winners"));
      if (res.ok) {
        const data = await res.json();
        setWinners(data.winners ?? {});
      }
    } catch {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    fetchWinners();
    const interval = setInterval(fetchWinners, 15_000);
    return () => clearInterval(interval);
  }, [fetchWinners]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setCredentials(btoa(`${username}:${password}`));
  }

  async function markWinner(categoryId: string, nomineeId: string) {
    if (!credentials) return;
    setPending(categoryId);
    try {
      const res = await fetch(apiUrl("/api/admin/winners"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify({ categoryId, nomineeId }),
      });
      if (res.ok) {
        setWinners((prev) => ({ ...prev, [categoryId]: nomineeId }));
      } else if (res.status === 401) {
        setCredentials(null);
        alert("Invalid credentials. Please re-authenticate.");
      }
    } catch {
      alert("Network error. Try again.");
    } finally {
      setPending(null);
    }
  }

  async function undoWinner(categoryId: string) {
    if (!credentials) return;
    setPending(categoryId);
    try {
      const res = await fetch(apiUrl("/api/admin/winners"), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify({ categoryId }),
      });
      if (res.ok) {
        setWinners((prev) => {
          const next = { ...prev };
          delete next[categoryId];
          return next;
        });
      }
    } catch {
      alert("Network error. Try again.");
    } finally {
      setPending(null);
    }
  }

  const announcedCount = Object.keys(winners).length;

  if (!credentials) {
    return (
      <div className="bg-card-bg border border-border rounded-xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={16} className="text-gold" />
          <h2 className="font-serif text-xl font-bold text-ink">
            Ceremony Night — Mark Winners
          </h2>
        </div>
        <form onSubmit={handleLogin} className="flex gap-3 items-end">
          <div>
            <label className="block text-xs font-mono text-muted mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-parchment text-ink text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-muted mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-parchment text-ink text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-gold text-white rounded-lg text-sm font-semibold hover:bg-gold/90 transition-colors"
          >
            Authenticate
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-card-bg border border-border rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-gold" />
          <h2 className="font-serif text-xl font-bold text-ink">
            Ceremony Night — Mark Winners
          </h2>
        </div>
        <span className="text-sm font-mono text-muted">
          {announcedCount}/{TOTAL_CATEGORIES} announced
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-border rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gold rounded-full transition-all duration-500"
          style={{ width: `${(announcedCount / TOTAL_CATEGORIES) * 100}%` }}
        />
      </div>

      {announcedCount === TOTAL_CATEGORIES && (
        <div className="text-center p-4 mb-4 bg-gold/10 border border-gold/20 rounded-xl">
          <p className="font-serif text-lg font-bold text-gold">
            All winners announced!
          </p>
        </div>
      )}

      <div className="space-y-3">
        {categories.map((cat) => {
          const winnerId = winners[cat.id];
          const winnerNominee = winnerId
            ? cat.nominees.find((n) => n.id === winnerId)
            : null;
          const isPending = pending === cat.id;

          return (
            <div
              key={cat.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                winnerNominee
                  ? "border-gold/30 bg-gold/5"
                  : "border-border"
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">
                  {cat.name}
                </p>
                {winnerNominee && (
                  <p className="text-xs text-gold font-mono truncate">
                    {winnerNominee.name} — {winnerNominee.film}
                  </p>
                )}
              </div>

              {winnerNominee ? (
                <div className="flex items-center gap-2 shrink-0">
                  <Trophy size={14} className="text-gold" />
                  <button
                    onClick={() => undoWinner(cat.id)}
                    disabled={isPending}
                    className="text-xs text-muted hover:text-ink transition-colors disabled:opacity-50"
                    title="Undo"
                  >
                    <Undo2 size={14} />
                  </button>
                </div>
              ) : (
                <select
                  className="text-xs border border-border rounded-lg px-2 py-1.5 bg-parchment text-ink max-w-[200px]
                             disabled:opacity-50"
                  disabled={isPending}
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) markWinner(cat.id, e.target.value);
                  }}
                >
                  <option value="" disabled>
                    Select winner...
                  </option>
                  {cat.nominees.map((nom) => (
                    <option key={nom.id} value={nom.id}>
                      {nom.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
