function PadelBall({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="lg-ball" cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#ecfccb"/>
          <stop offset="50%" stopColor="#a3e635"/>
          <stop offset="100%" stopColor="#4d7c0f"/>
        </radialGradient>
      </defs>
      <circle cx="17" cy="17" r="16" fill="url(#lg-ball)"/>
      <path d="M 12,2 C 3.5,8.5 3.5,25.5 12,32" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.88"/>
      <path d="M 22,2 C 30.5,8.5 30.5,25.5 22,32" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.88"/>
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
