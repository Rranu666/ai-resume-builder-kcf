export default function KCFAILogo() {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* AI Circle Badge */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Outer circle border */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(201,149,108,0.5))',
          }}
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="rgba(201,149,108,0.7)"
            strokeWidth="2"
          />
        </svg>

        {/* AI Text */}
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '42px',
            fontWeight: 900,
            letterSpacing: '0.2em',
            background: 'linear-gradient(180deg, #D4A574 0%, #C9956C 50%, #A0734D 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 10px rgba(201,149,108,0.6))',
            lineHeight: 1,
          }}
        >
          AI
        </div>
      </div>

      {/* KCF AI Text */}
      <div
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '20px',
          fontWeight: 700,
          letterSpacing: '0.25em',
          color: '#FFFFFF',
          textShadow: '0 0 12px rgba(201,149,108,0.4)',
        }}
      >
        KCF AI
      </div>

      {/* Powered by AI */}
      <div
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '11px',
          fontWeight: 400,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(212,165,116,0.8)',
          textShadow: '0 0 8px rgba(201,149,108,0.3)',
        }}
      >
        Powered by <span style={{ color: '#C9956C' }}>AI</span>
      </div>
    </div>
  );
}