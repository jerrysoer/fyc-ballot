import { z } from "zod";

export const eventBodySchema = z.object({
  event: z.enum([
    "quiz-completed",
    "ballot-completed",
    "card-shared",
    "card-downloaded",
    "sinners-picked",
    "cemetery-visited",
    "tombstone-shared",
    "trailer-clicked",
  ]),
  sessionId: z.string().uuid().optional(),
  data: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
});

export type EventBody = z.infer<typeof eventBodySchema>;
