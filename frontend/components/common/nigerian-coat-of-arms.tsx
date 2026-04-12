export function NigerianCoatOfArms() {
  return (
    <svg
      viewBox="0 0 200 240"
      className="w-10 h-10"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shield */}
      <path
        d="M 100 20 L 160 50 L 160 120 Q 100 180 100 180 Q 100 180 40 120 L 40 50 Z"
        fill="#065F46"
        stroke="#FBBF24"
        strokeWidth="2"
      />

      {/* Shield interior - white and green sections */}
      <rect x="50" y="60" width="50" height="60" fill="white" />
      <rect x="100" y="60" width="50" height="60" fill="#065F46" />

      {/* Vertical divider - red */}
      <line x1="100" y1="60" x2="100" y2="120" stroke="#FB923C" strokeWidth="3" />

      {/* Eagle body */}
      <ellipse cx="100" cy="50" rx="15" ry="18" fill="#065F46" />

      {/* Eagle head */}
      <circle cx="100" cy="35" r="8" fill="#065F46" />
      <circle cx="105" cy="34" r="3" fill="#FBBF24" />

      {/* Eagle wings */}
      <path
        d="M 85 48 Q 70 42 65 52"
        stroke="#065F46"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 115 48 Q 130 42 135 52"
        stroke="#065F46"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Center emblem circle */}
      <circle cx="100" cy="90" r="12" fill="#FBBF24" />
      <circle cx="100" cy="90" r="9" fill="white" />
      
      {/* Star in center */}
      <circle cx="100" cy="88" r="2" fill="#065F46" />

      {/* Base plate */}
      <rect x="60" y="170" width="80" height="8" fill="#065F46" />
      <rect x="60" y="170" width="80" height="3" fill="#FBBF24" />

      {/* Decorative elements on sides */}
      <circle cx="45" cy="90" r="4" fill="#FBBF24" />
      <circle cx="155" cy="90" r="4" fill="#FBBF24" />
    </svg>
  )
}
