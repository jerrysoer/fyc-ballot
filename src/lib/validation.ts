import { z } from "zod";
import { categories } from "@/data/nominees";

// Build allowlists from the nominee data
const validCategoryIds = new Set(categories.map((c) => c.id));
const validNomineeIds = new Set(
  categories.flatMap((c) => c.nominees.map((n) => n.id))
);
const validNomineeByCategory = new Map<string, Set<string>>();
for (const cat of categories) {
  validNomineeByCategory.set(cat.id, new Set(cat.nominees.map((n) => n.id)));
}

export const ballotBodySchema = z.object({
  sessionId: z.string().uuid(),
  archetype: z.enum(["film-bro", "chaos-agent", "safe-picker", "underdog-stan"]),
  picks: z.record(z.string(), z.string()),
});

export type BallotBody = z.infer<typeof ballotBodySchema>;

/**
 * Validate that picks only contain valid category/nominee ID pairs.
 * Returns an error string if invalid, null if valid.
 */
export function validatePicks(
  picks: Record<string, string>
): string | null {
  for (const [categoryId, nomineeId] of Object.entries(picks)) {
    if (!validCategoryIds.has(categoryId)) {
      return `Unknown category: ${categoryId}`;
    }
    if (!validNomineeIds.has(nomineeId)) {
      return `Unknown nominee: ${nomineeId}`;
    }
    const allowed = validNomineeByCategory.get(categoryId);
    if (allowed && !allowed.has(nomineeId)) {
      return `Nominee ${nomineeId} not valid for category ${categoryId}`;
    }
  }
  return null;
}
