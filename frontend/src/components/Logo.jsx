function PadelBall({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="b-main" cx="36%" cy="28%" r="70%">
          <stop offset="0%"   stopColor="#f9ffaa"/>
          <stop offset="22%"  stopColor="#d6f23c"/>
          <stop offset="62%"  stopColor="#78b813"/>
          <stop offset="100%" stopColor="#3a6408"/>
        </radialGradient>
        <radialGradient id="b-depth" cx="72%" cy="74%" r="50%">
          <stop offset="0%"   stopColor="#1a3803" stopOpacity="0.65"/>
          <stop offset="100%" stopColor="#1a3803" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="b-gloss" cx="28%" cy="20%" r="28%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.85"/>
          <stop offset="65%"  stopColor="white" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="17" cy="17" r="16" fill="url(#b-main)"/>
      <circle cx="17" cy="17" r="16" fill="url(#b-depth)"/>
      <path d="M11 2C1.5 8.5 1.5 25.5 11 32" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.88"/>
      <path d="M23 2C32.5 8.5 32.5 25.5 23 32" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.88"/>
      <circle cx="17" cy="17" r="16" fill="url(#b-gloss)"/>
    </svg>
  );
}

function Logo() {
  return (
    <div className="logo">
      <PadelBall size={34} />
      <strong>
        Pista<span>Go</span>
      </strong>
    </div>
  );
}

export default Logo;
