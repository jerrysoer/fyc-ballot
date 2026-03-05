"use client";

interface TombstoneProps {
  categoryName: string;
  nomineeName: string;
  winnerName: string;
  delay?: number;
}

const causeOfDeath = [
  "Death by frontrunner momentum",
  "Lost to the campaign machine",
  "Buried by precursor season",
  "Killed by preferential ballot",
  "Victim of the Oscar narrative",
  "Taken out by the industry vote",
  "Crushed by the consensus pick",
  "Undone by the guild awards",
];

export default function Tombstone({
  categoryName,
  nomineeName,
  winnerName,
  delay = 0,
}: TombstoneProps) {
  const cause = causeOfDeath[Math.abs(categoryName.length + nomineeName.length) % causeOfDeath.length];

  return (
    <div
      className="animate-tombstone-rise opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="bg-cemetery-card border border-cemetery-muted/30 rounded-xl p-6 text-center relative overflow-hidden">
        {/* Film strip decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cemetery-muted/30 to-transparent" />

        <p className="text-[10px] uppercase tracking-[0.2em] text-cemetery-muted mb-3 font-mono">
          {categoryName}
        </p>

        <p className="text-xs uppercase tracking-widest text-cemetery-muted/60 mb-2 font-serif">
          Here Lies
        </p>

        <h3 className="font-serif text-xl font-bold text-cemetery-text mb-2">
          {nomineeName}
        </h3>

        <p className="text-sm italic text-cemetery-muted mb-4 font-serif">
          &ldquo;{cause}&rdquo;
        </p>

        <div className="border-t border-cemetery-muted/20 pt-3">
          <p className="text-xs text-cemetery-muted">
            Lost to: <span className="text-gold font-semibold">{winnerName}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
