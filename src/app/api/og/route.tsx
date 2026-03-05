import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
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
          backgroundColor: "#F7F0E3",
          position: "relative",
        }}
      >
        {/* Top gold bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #C9963A 0%, #E8C875 50%, #C9963A 100%)",
          }}
        />

        {/* Bottom gold bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #C9963A 0%, #E8C875 50%, #C9963A 100%)",
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            fontSize: "18px",
            letterSpacing: "0.3em",
            color: "#8C7B65",
            textTransform: "uppercase",
            marginBottom: "20px",
            fontFamily: "sans-serif",
          }}
        >
          The 98th Academy Awards
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: 700,
            color: "#C9963A",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: "8px",
            fontFamily: "serif",
          }}
        >
          For Your
        </div>
        <div
          style={{
            fontSize: "72px",
            fontWeight: 700,
            color: "#C9963A",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: "24px",
            fontFamily: "serif",
          }}
        >
          Consideration
        </div>

        {/* Flame accent */}
        <svg
          width="28"
          height="34"
          viewBox="0 0 22 26"
          fill="none"
          style={{ marginBottom: "24px" }}
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

        {/* Tagline */}
        <div
          style={{
            fontSize: "24px",
            color: "#1A1A2E",
            textAlign: "center",
            lineHeight: 1.6,
            fontFamily: "sans-serif",
            fontWeight: 600,
          }}
        >
          Fill out your ballot. Get roasted.
        </div>

        {/* Decorative divider */}
        <div
          style={{
            width: "80px",
            height: "2px",
            backgroundColor: "#C9963A",
            marginTop: "28px",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
