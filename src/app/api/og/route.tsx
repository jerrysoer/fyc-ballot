import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  const [playfairData, dmSansData] = await Promise.all([
    fetch(
      "https://fonts.gstatic.com/s/playfairdisplay/v40/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKeiukDQ.ttf"
    ).then((res) => res.arrayBuffer()),
    fetch(
      "https://fonts.gstatic.com/s/dmsans/v17/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAkJxhTg.ttf"
    ).then((res) => res.arrayBuffer()),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1A1A2E",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Radial gold glow — center spotlight effect */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "50%",
            width: "900px",
            height: "900px",
            marginLeft: "-450px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(201, 150, 58, 0.15) 0%, rgba(201, 150, 58, 0.05) 40%, transparent 70%)",
          }}
        />

        {/* Film strip perforations — top */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            borderBottom: "1px solid rgba(201, 150, 58, 0.3)",
          }}
        >
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "16px",
                height: "10px",
                borderRadius: "2px",
                backgroundColor: "rgba(201, 150, 58, 0.2)",
                border: "1px solid rgba(201, 150, 58, 0.15)",
              }}
            />
          ))}
        </div>

        {/* Film strip perforations — bottom */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            borderTop: "1px solid rgba(201, 150, 58, 0.3)",
          }}
        >
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "16px",
                height: "10px",
                borderRadius: "2px",
                backgroundColor: "rgba(201, 150, 58, 0.2)",
                border: "1px solid rgba(201, 150, 58, 0.15)",
              }}
            />
          ))}
        </div>

        {/* Gold accent lines — left */}
        <div
          style={{
            position: "absolute",
            top: "32px",
            bottom: "32px",
            left: "48px",
            width: "1px",
            background:
              "linear-gradient(180deg, transparent 0%, rgba(201, 150, 58, 0.4) 30%, rgba(201, 150, 58, 0.4) 70%, transparent 100%)",
          }}
        />

        {/* Gold accent lines — right */}
        <div
          style={{
            position: "absolute",
            top: "32px",
            bottom: "32px",
            right: "48px",
            width: "1px",
            background:
              "linear-gradient(180deg, transparent 0%, rgba(201, 150, 58, 0.4) 30%, rgba(201, 150, 58, 0.4) 70%, transparent 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 80px",
          }}
        >
          {/* Subtitle */}
          <div
            style={{
              fontSize: "16px",
              letterSpacing: "0.35em",
              color: "#8C7B65",
              textTransform: "uppercase",
              marginBottom: "28px",
              fontFamily: "DM Sans",
              fontWeight: 500,
            }}
          >
            The 98th Academy Awards
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: "88px",
              fontWeight: 700,
              color: "#C9963A",
              textAlign: "center",
              lineHeight: 1.0,
              fontFamily: "Playfair Display",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span>For Your</span>
            <span>Consideration</span>
          </div>

          {/* Gold divider with flame */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              margin: "32px 0",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(201, 150, 58, 0.6))",
              }}
            />

            {/* Flame icon */}
            <svg
              width="24"
              height="30"
              viewBox="0 0 22 26"
              fill="none"
            >
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

            <div
              style={{
                width: "80px",
                height: "1px",
                background:
                  "linear-gradient(90deg, rgba(201, 150, 58, 0.6), transparent)",
              }}
            />
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: "26px",
              color: "#E8E0D0",
              textAlign: "center",
              lineHeight: 1.5,
              fontFamily: "DM Sans",
              fontWeight: 500,
            }}
          >
            Fill out your ballot. Get roasted.
          </div>

          {/* Bottom badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "32px",
              padding: "8px 20px",
              borderRadius: "100px",
              border: "1px solid rgba(201, 150, 58, 0.3)",
              backgroundColor: "rgba(201, 150, 58, 0.08)",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#C9963A",
              }}
            />
            <div
              style={{
                fontSize: "13px",
                letterSpacing: "0.2em",
                color: "#C9963A",
                textTransform: "uppercase",
                fontFamily: "DM Sans",
                fontWeight: 500,
              }}
            >
              10 Categories · Live Odds · Chaos Score
            </div>
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
      ],
    }
  );
}
