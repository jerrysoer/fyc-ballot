import { apiUrl } from "@/lib/api";

type EventName =
  | "quiz-completed"
  | "ballot-completed"
  | "card-shared"
  | "card-downloaded"
  | "sinners-picked"
  | "cemetery-visited"
  | "tombstone-shared"
  | "trailer-clicked";

function getSessionId(): string | undefined {
  try {
    const raw = localStorage.getItem("fyc-session");
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    return typeof parsed.sessionId === "string" ? parsed.sessionId : undefined;
  } catch {
    return undefined;
  }
}

export function trackEvent(
  event: EventName,
  data?: Record<string, string | number>,
): void {
  try {
    const sessionId = getSessionId();

    fetch(apiUrl("/api/events"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, sessionId, data }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Analytics unavailable — silent fail
  }
}
