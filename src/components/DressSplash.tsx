// A colorful decorative dress illustration for the empty/demo state.
export function DressSplash() {
  return (
    <svg
      className="dress-splash"
      viewBox="0 0 200 220"
      role="img"
      aria-label="Colorful dress illustration"
    >
      <defs>
        <linearGradient id="skirt" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff5c8f" />
          <stop offset="45%" stopColor="#a06bff" />
          <stop offset="100%" stopColor="#4adebb" />
        </linearGradient>
        <linearGradient id="bodice" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffc15e" />
          <stop offset="100%" stopColor="#ff5c8f" />
        </linearGradient>
      </defs>

      {/* straps + bodice */}
      <path d="M84 26 L100 60 L116 26" fill="none" stroke="#ffc15e" strokeWidth="5" strokeLinecap="round" />
      <path d="M78 58 Q100 46 122 58 L116 108 Q100 118 84 108 Z" fill="url(#bodice)" />

      {/* flared skirt */}
      <path d="M84 106 Q100 116 116 106 L164 196 Q100 214 36 196 Z" fill="url(#skirt)" />

      {/* hem ruffle */}
      <path
        d="M36 196 Q52 184 68 196 Q84 208 100 196 Q116 184 132 196 Q148 208 164 196"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.55"
        strokeWidth="3"
      />

      {/* waist tie */}
      <rect x="82" y="104" width="36" height="7" rx="3.5" fill="#4adebb" />

      {/* confetti splashes */}
      <circle cx="30" cy="70" r="5" fill="#ffc15e" />
      <circle cx="176" cy="86" r="6" fill="#7c9cff" />
      <circle cx="168" cy="40" r="4" fill="#ff5c8f" />
      <circle cx="26" cy="140" r="4" fill="#4adebb" />
    </svg>
  );
}
