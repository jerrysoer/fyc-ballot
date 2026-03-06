"use client";

import { Category } from "@/types";
import { polymarketSlugs } from "@/data/polymarket-slugs";
import { discourse } from "@/data/discourse";
import NomineeButton from "./NomineeButton";

interface CategoryCardProps {
  category: Category;
  selectedNominee: string | undefined;
  onSelect: (categoryId: string, nomineeId: string) => void;
  progress: string; // e.g. "7/24"
  animationClass?: string;
  odds?: Record<string, number>; // nomineeId → probability
  communityStats?: Record<string, number>;
}

function getCommunityStatLine(percentage: number): string {
  if (percentage < 5) return `Only ${percentage}% chose this. You beautiful contrarian.`;
  if (percentage < 20) return `Only ${percentage}% went this bold — respect`;
  if (percentage >= 50) return `${percentage}% of ballots agree with you`;
  return `${percentage}% of ballots picked the same`;
}

export default function CategoryCard({
  category,
  selectedNominee,
  onSelect,
  progress,
  animationClass,
  odds,
  communityStats,
}: CategoryCardProps) {
  const pickedPercentage =
    selectedNominee && communityStats
      ? communityStats[selectedNominee]
      : undefined;

  return (
    <div className={`max-w-lg mx-auto ${animationClass ?? ""}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-mono text-muted uppercase tracking-widest">
          {progress}
        </p>
      </div>

      <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink mb-2">
        {category.name}
      </h2>

      <p className="font-serif italic text-muted mb-2 leading-relaxed">
        &ldquo;{category.appComment}&rdquo;
      </p>

      {discourse[category.id] && (
        <p className="text-xs italic text-muted/70 mb-6">
          💬 {discourse[category.id]}
        </p>
      )}

      <div className="space-y-3">
        {category.nominees.map((nominee) => {
          const nomineeOdds = odds?.[nominee.id];
          const isHotTake = selectedNominee === nominee.id
            && nomineeOdds !== undefined
            && nomineeOdds < 0.30;
          return (
            <NomineeButton
              key={nominee.id}
              nominee={nominee}
              isSelected={selectedNominee === nominee.id}
              onSelect={(nomineeId) => onSelect(category.id, nomineeId)}
              odds={nomineeOdds}
              polymarketSlug={polymarketSlugs[category.id]}
              isHotTake={isHotTake}
            />
          );
        })}
      </div>

      {pickedPercentage !== undefined && (
        <p className="text-sm font-mono text-muted italic mt-4 text-center animate-fade-in">
          {getCommunityStatLine(pickedPercentage)}
        </p>
      )}
    </div>
  );
}
