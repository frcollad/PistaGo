import ClubImage from "../components/ClubImage";

function CourtSVG({ puesto, club }) {
  const p = (puesto || "").toLowerCase();
  const highlightLeft  = p.includes("rev") || p.includes("indiferente");
  const highlightRight = p.includes("derecha") || p.includes("indiferente");
  const hl = "rgba(34,197,94,0.35)";

  return (
    <svg viewBox="0 0 360 160" xmlns="http://www.w3.org/2000/svg" className="dci-svg">
      <rect width="360" height="160" fill="#0a1628"/>
      {highlightLeft  && <rect x="40"  y="20" width="140" height="120" rx="4" fill={hl}/>}
      {highlightRight && <rect x="180" y="20" width="140" height="120" rx="4" fill={hl}/>}
      <rect x="40" y="20" width="280" height="120" rx="4" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
      <line x1="180" y1="20" x2="180" y2="140" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
      <rect x="40" y="45" width="280" height="70" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
      <line x1="40" y1="80" x2="320" y2="80" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5"/>
      <line x1="180" y1="45" x2="180" y2="115" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
      {/* etiqueta fija REVÉS (izquierda) */}
      <text x="110" y="37" textAnchor="middle"
        fill={highlightLeft ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.2)"}
        fontSize="9" fontWeight="700" fontFamily="system-ui" letterSpacing="1">REVÉS</text>
      {highlightLeft && (
        <text x="110" y="90" textAnchor="middle" fill="rgba(34,197,94,0.95)" fontSize="12" fontWeight="800" fontFamily="system-ui">LIBRE</text>
      )}
      {/* etiqueta fija DERECHA (derecha) */}
      <text x="250" y="37" textAnchor="middle"
        fill={highlightRight ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.2)"}
        fontSize="9" fontWeight="700" fontFamily="system-ui" letterSpacing="1">DERECHA</text>
      {highlightRight && (
        <text x="250" y="90" textAnchor="middle" fill="rgba(34,197,94,0.95)" fontSize="12" fontWeight="800" fontFamily="system-ui">LIBRE</text>
      )}
      <text x="180" y="154" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="system-ui">{club}</text>
    </svg>
  );
}

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-value">{value}</span>
    </div>
  );
}

function DetailScreen({ selectedMatch, onBack }) {
  if (!selectedMatch) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🎾</div>
        <h2>No hay detalle disponible</h2>
        <p>Vuelve a buscar una pista o partida.</p>
        <button className="main-btn" onClick={onBack}>Volver</button>
      </div>
    );
  }

  const esPista = selectedMatch.color === "blue";

  return (
    <div className="detail-screen">
      {/* Top bar */}
      <div className="detail-topbar">
        <button className="detail-back" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <span className="detail-topbar-title">PistaGo</span>
        <button className="detail-heart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      <div className="detail-scroll">
        {/* Type + name + location */}
        <div className="detail-hero">
          <span className={`tag ${selectedMatch.color}`}>{selectedMatch.type}</span>
          <div className="detail-hero-row">
            <div>
              <h1 className="detail-club">{selectedMatch.club}</h1>
              <p className="detail-city">📍 {selectedMatch.city}</p>
            </div>
            <ClubImage club={selectedMatch.club} size={52} />
          </div>
        </div>

        {/* 4 stat cards */}
        <div className="detail-stats">
          <div className="dstat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <small>Fecha</small>
            <strong>{selectedMatch.date}</strong>
          </div>
          <div className="dstat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <small>Hora</small>
            <strong>{selectedMatch.time}</strong>
          </div>
          <div className="dstat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            <small>Nivel</small>
            <strong>{selectedMatch.level || "—"}</strong>
          </div>
          <div className="dstat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <small>Plazas</small>
            <strong>{selectedMatch.spots || "—"}</strong>
          </div>
        </div>

        {/* Court image */}
        <div className="detail-court-img">
          <CourtSVG puesto={selectedMatch.puesto} club={selectedMatch.club} />
        </div>

        {/* Info table */}
        <div className="detail-section">
          <h2>Información</h2>
          <div className="info-table">
            <InfoRow label="Tipo" value={esPista ? "Pista libre" : "Partido Americano"} />
            {selectedMatch.level && <InfoRow label="Nivel recomendado" value={selectedMatch.level} />}
            {selectedMatch.puesto && <InfoRow label="Puesto buscado" value={selectedMatch.puesto} />}
            <InfoRow label="Disponibilidad" value={selectedMatch.spots} />
            <InfoRow label="Organizador" value={selectedMatch.club} />
            <InfoRow label="Plataforma" value={selectedMatch.source || "TPC Matchpoint"} />
          </div>
        </div>

        {/* Redirect notice */}
        <div className="detail-notice">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>Al {esPista ? "reservar" : "apuntarte"} serás redirigido a la plataforma oficial para completar tu reserva.</p>
        </div>

        {/* Spacer for sticky bottom */}
        <div style={{ height: 90 }} />
      </div>

      {/* Sticky CTA */}
      <div className="detail-cta">
        <button className="detail-cta-btn">
          {esPista ? "Reservar en el club →" : "Apuntarme ahora →"}
        </button>
      </div>
    </div>
  );
}

export default DetailScreen;
