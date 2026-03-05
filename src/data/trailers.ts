/**
 * Curated YouTube trailer URLs for key nominees.
 * Falls back to a YouTube search for films not listed here.
 */
const curatedTrailers: Record<string, string> = {
  // Best Picture nominees
  "Sinners": "https://www.youtube.com/watch?v=7joulECTx_U",
  "One Battle After Another": "https://www.youtube.com/watch?v=Ap-j8e9J5U0",
  "Marty Supreme": "https://www.youtube.com/watch?v=s9gSuKaKcqM",
  "F1": "https://www.youtube.com/watch?v=8yh9BPUBbbQ",
  "Frankenstein": "https://www.youtube.com/watch?v=9WZllcEgWrM",
};

export function getTrailerUrl(filmTitle: string): string {
  if (curatedTrailers[filmTitle]) return curatedTrailers[filmTitle];
  // Strip parenthetical suffixes like "(Brazil)" for international films
  const clean = filmTitle.replace(/\s*\([^)]+\)\s*$/, "");
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(clean)}+official+trailer+2025`;
}
