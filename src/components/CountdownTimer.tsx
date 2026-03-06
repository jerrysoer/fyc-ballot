"use client";

import { useState, useEffect } from "react";

// March 15, 2026 at 8:00 PM ET = March 16, 2026 at 01:00 UTC
const CEREMONY_DATE = new Date("2026-03-16T01:00:00Z");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  totalHours: number;
}

function getTimeLeft(): TimeLeft | null {
  const now = new Date();
  const diff = CEREMONY_DATE.getTime() - now.getTime();

  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    totalHours: diff / (1000 * 60 * 60),
  };
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  if (!timeLeft) {
    return (
      <p className="text-sm font-mono text-gold uppercase tracking-widest mb-6 animate-fade-in">
        The ceremony has begun!
      </p>
    );
  }

  // < 1 hour: maximum urgency
  if (timeLeft.totalHours < 1) {
    return (
      <div className="text-center mb-6 animate-fade-in">
        <p className="text-sm font-mono text-chaos-red uppercase tracking-widest font-bold animate-pulse"
           style={{ animationDuration: "0.8s" }}>
          IT&apos;S HAPPENING
        </p>
        <p className="text-xs text-muted mt-1 font-mono">
          {timeLeft.minutes} min until curtain
        </p>
      </div>
    );
  }

  // < 24 hours: high urgency
  if (timeLeft.totalHours < 24) {
    return (
      <div className="text-center mb-6 animate-fade-in">
        <p className="text-sm font-mono text-gold uppercase tracking-widest font-bold animate-pulse">
          TONIGHT — {timeLeft.hours > 0 ? `${timeLeft.hours} hr${timeLeft.hours !== 1 ? "s" : ""} ` : ""}
          {timeLeft.minutes} min until Oscar night
        </p>
        <p className="text-xs text-muted mt-1 italic">
          Conan promised explosions. Lock your ballot before the fuse lights.
        </p>
      </div>
    );
  }

  // Default: calm countdown
  const parts: string[] = [];
  if (timeLeft.days > 0) parts.push(`${timeLeft.days} day${timeLeft.days !== 1 ? "s" : ""}`);
  if (timeLeft.hours > 0) parts.push(`${timeLeft.hours} hr${timeLeft.hours !== 1 ? "s" : ""}`);
  if (timeLeft.days === 0) parts.push(`${timeLeft.minutes} min`);

  return (
    <p className="text-sm font-mono text-muted mb-6 animate-fade-in">
      <span className="text-gold font-semibold">{parts.join(", ")}</span>
      {" "}until Oscar night
    </p>
  );
}
