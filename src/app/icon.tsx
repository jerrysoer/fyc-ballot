import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1A1A2E",
          borderRadius: "6px",
        }}
      >
        <svg
          width="22"
          height="26"
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
      </div>
    ),
    { ...size }
  );
}
