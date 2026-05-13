import React from 'react';

export default function BrandMark({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="4" y="4" width="56" height="56" rx="18" fill="#0f172a" />
      <rect
        x="4"
        y="4"
        width="56"
        height="56"
        rx="18"
        fill="#38bdf8"
        fillOpacity="0.12"
      />
      <path
        d="M32 14L46 20V30C46 39.3 40.2 47.2 32 50C23.8 47.2 18 39.3 18 30V20L32 14Z"
        fill="#1d63ed"
      />
      <path
        d="M32 20L40 23.5V30C40 36.6 36.2 42.2 32 44.3C27.8 42.2 24 36.6 24 30V23.5L32 20Z"
        fill="#7dd3fc"
        fillOpacity="0.24"
      />
      <path
        d="M24.5 31.5H29L31.5 27.5L34.5 35L37 31.5H39.5"
        stroke="#e0f2fe"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="39.5" cy="31.5" r="2.2" fill="#e0f2fe" />
    </svg>
  );
}
