// Gold Derby / Polymarket consensus picks — hardcoded for the 98th Oscars.
// These are the "safe" picks used to compute chaos scores.
// categoryId → nomineeId
export const frontrunners: Record<string, string> = {
  "best-picture": "one-battle",
  "best-director": "dir-pta",
  "best-actress": "actress-buckley",
  "best-actor": "actor-chalamet",
  "best-supporting-actress": "sa-taylor",
  "best-supporting-actor": "sup-skarsgard",
  "best-adapted-screenplay": "as-one-battle",
  "best-original-screenplay": "os-sinners",
  "best-animated-feature": "af-kpop",
  "best-original-score": "sc-sinners",
};
