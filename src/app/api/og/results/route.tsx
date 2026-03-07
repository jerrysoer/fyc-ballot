import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const archetypeTitles: Record<string, string> = {
  "film-bro": "The Film Bro",
  "chaos-agent": "The Chaos Agent",
  "safe-picker": "The Safe Picker",
  "underdog-stan": "The Underdog Stan",
};

const archetypeTaglines: Record<string, string> = {
  "film-bro": "Seen everything. Twice. In 70mm.",
  "chaos-agent": "Wants to watch the Oscars burn.",
  "safe-picker": "Reads the room. The room is Gold Derby.",
  "underdog-stan": "If it\u2019s popular, it\u2019s wrong.",
};

function getChaosLabel(score: number): string {
  if (score <= 20) return "Academy Approved\u2122";
  if (score <= 40) return "Mild Spice";
  if (score <= 60) return "Interesting Choices";
  if (score <= 80) return "Unhinged Energy";
  return "Full Chaos Mode";
}

function getChaosColor(score: number): string {
  if (score <= 20) return "#2B5F8E";
  if (score <= 40) return "#4A7C59";
  if (score <= 60) return "#C9963A";
  if (score <= 80) return "#E8863A";
  return "#C43E1C";
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const score = Math.min(
    100,
    Math.max(0, Number(searchParams.get("score")) || 42)
  );
  const archetype = searchParams.get("archetype") || "safe-picker";
  const picks = searchParams.get("picks") || "10";

  const [playfairData, dmSansData, dmMonoData] = await Promise.all([
    fetch(
      "https://fonts.gstatic.com/s/playfairdisplay/v40/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKeiukDQ.ttf"
    ).then((res) => res.arrayBuffer()),
    fetch(
      "https://fonts.gstatic.com/s/dmsans/v17/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAkJxhTg.ttf"
    ).then((res) => res.arrayBuffer()),
    fetch(
      "https://fonts.gstatic.com/s/dmmono/v16/aFTU7PB1QTsUX8KYhh0.ttf"
    ).then((res) => res.arrayBuffer()),
  ]);

  const chaosColor = getChaosColor(score);
  const chaosLabel = getChaosLabel(score);
  const title = archetypeTitles[archetype] ?? "The Wildcard";
  const tagline = archetypeTaglines[archetype] ?? "Unpredictable by nature.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          backgroundColor: "#1A1A2E",
          position: "relative",
        }}
      >
        {/* Film strip — top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            backgroundColor: "rgba(0,0,0,0.4)",
            borderBottom: "1px solid rgba(201,150,58,0.2)",
          }}
        >
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "14px",
                height: "8px",
                borderRadius: "2px",
                backgroundColor: "rgba(201,150,58,0.15)",
              }}
            />
          ))}
        </div>

        {/* Film strip — bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            backgroundColor: "rgba(0,0,0,0.4)",
            borderTop: "1px solid rgba(201,150,58,0.2)",
          }}
        >
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "14px",
                height: "8px",
                borderRadius: "2px",
                backgroundColor: "rgba(201,150,58,0.15)",
              }}
            />
          ))}
        </div>

        {/* Left panel — Score */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "460px",
            position: "relative",
          }}
        >
          {/* Glow */}
          <div
            style={{
              position: "absolute",
              width: "360px",
              height: "360px",
              borderRadius: "9999px",
              background: `radial-gradient(circle, ${chaosColor}22 0%, transparent 70%)`,
              display: "flex",
            }}
          />

          {/* Score circle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "200px",
              height: "200px",
              borderRadius: "9999px",
              border: `4px solid ${chaosColor}`,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "72px",
                  fontWeight: 700,
                  color: chaosColor,
                  fontFamily: "Playfair Display",
                  lineHeight: 1,
                }}
              >
                {String(score)}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.25em",
                  color: "#8C7B65",
                  textTransform: "uppercase",
                  fontFamily: "DM Mono",
                  marginTop: "6px",
                }}
              >
                CHAOS SCORE
              </span>
            </div>
          </div>

          {/* Chaos label pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "20px",
              padding: "6px 16px",
              borderRadius: "9999px",
              border: `1px solid ${chaosColor}55`,
              backgroundColor: `${chaosColor}15`,
            }}
          >
            <svg width="12" height="15" viewBox="0 0 22 26" fill="none">
              <path
                d="M11 0C11 0 4 8 4 15C4 19.4 7.1 23 11 23C14.9 23 18 19.4 18 15C18 8 11 0 11 0Z"
                fill="#C43E1C"
              />
              <path
                d="M11 8C11 8 7.5 13 7.5 17C7.5 19.2 9.1 21 11 21C12.9 21 14.5 19.2 14.5 17C14.5 13 11 8 11 8Z"
                fill="#E8863A"
              />
              <path
                d="M11 14C11 14 9.5 16.5 9.5 18C9.5 19.4 10.2 20 11 20C11.8 20 12.5 19.4 12.5 18C12.5 16.5 11 14 11 14Z"
                fill="#F5C842"
              />
            </svg>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: chaosColor,
                fontFamily: "DM Sans",
                letterSpacing: "0.05em",
              }}
            >
              {chaosLabel}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "1px",
              height: "300px",
              background:
                "linear-gradient(180deg, transparent, rgba(201,150,58,0.3), transparent)",
            }}
          />
        </div>

        {/* Right panel — Identity */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            padding: "60px 56px",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              letterSpacing: "0.3em",
              color: "#8C7B65",
              textTransform: "uppercase",
              fontFamily: "DM Sans",
              marginBottom: "12px",
            }}
          >
            YOUR OSCARS ARCHETYPE
          </span>

          <span
            style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "#C9963A",
              fontFamily: "Playfair Display",
              lineHeight: 1.1,
              marginBottom: "12px",
            }}
          >
            {title}
          </span>

          <span
            style={{
              fontSize: "19px",
              color: "#B8A994",
              fontFamily: "DM Sans",
              lineHeight: 1.5,
              marginBottom: "32px",
              fontStyle: "italic",
            }}
          >
            {`\u201C${tagline}\u201D`}
          </span>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "28px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  fontSize: "26px",
                  fontWeight: 700,
                  color: "#E8E0D0",
                  fontFamily: "Playfair Display",
                }}
              >
                {`${picks}/10`}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  color: "#8C7B65",
                  textTransform: "uppercase",
                  fontFamily: "DM Mono",
                }}
              >
                PICKS MADE
              </span>
            </div>

            <div
              style={{
                width: "1px",
                height: "40px",
                backgroundColor: "rgba(201,150,58,0.2)",
                display: "flex",
              }}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  fontSize: "26px",
                  fontWeight: 700,
                  color: "#E8E0D0",
                  fontFamily: "Playfair Display",
                }}
              >
                98th
              </span>
              <span
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  color: "#8C7B65",
                  textTransform: "uppercase",
                  fontFamily: "DM Mono",
                }}
              >
                OSCARS
              </span>
            </div>
          </div>

          {/* CTA */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                padding: "10px 24px",
                borderRadius: "8px",
                backgroundColor: "rgba(201,150,58,0.12)",
                border: "1px solid rgba(201,150,58,0.3)",
                fontSize: "15px",
                color: "#C9963A",
                fontFamily: "DM Sans",
                fontWeight: 500,
              }}
            >
              {`Think you can do better? Fill out yours \u2192`}
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Playfair Display",
          data: playfairData,
          weight: 700,
          style: "normal",
        },
        {
          name: "DM Sans",
          data: dmSansData,
          weight: 500,
          style: "normal",
        },
        {
          name: "DM Mono",
          data: dmMonoData,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
}
