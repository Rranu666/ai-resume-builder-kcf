export default function KLogo({ size = 40 }) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id="kGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d9ff" />
          <stop offset="100%" stopColor="#39ff14" />
        </linearGradient>
        <filter id="kGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Rounded square background */}
      <rect
        x="0"
        y="0"
        width="200"
        height="200"
        rx="40"
        fill="#0a5f5f"
        stroke="url(#kGrad)"
        strokeWidth="2"
        filter="url(#kGlow)"
      />

      {/* K letter - left vertical bar */}
      <rect
        x="45"
        y="45"
        width="35"
        height="110"
        rx="8"
        fill="#e8f8f8"
      />

      {/* K letter - top right diagonal */}
      <g>
        <path
          d="M 100 55 L 155 95 L 145 110 L 95 75 Z"
          fill="#e8f8f8"
        />
      </g>

      {/* K letter - bottom right diagonal */}
      <g>
        <path
          d="M 95 125 L 155 105 L 165 120 L 100 145 Z"
          fill="#e8f8f8"
        />
      </g>

      {/* Center circle connector */}
      <circle
        cx="110"
        cy="100"
        r="20"
        fill="#0a5f5f"
        stroke="#e8f8f8"
        strokeWidth="6"
      />
    </svg>
  );
}