import ClubImage from "../components/ClubImage";

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

        {/* Court image placeholder */}
        <div className="detail-court-img">
          <div className="dci-inner">
            <span>🎾</span>
            <span>{selectedMatch.club}</span>
          </div>
        </div>

        {/* Info table */}
        <div className="detail-section">
          <h2>Información</h2>
          <div className="info-table">
            <InfoRow label="Tipo" value={esPista ? "Pista libre" : "Partido Americano"} />
            <InfoRow label="Precio" value={esPista ? "24 € por pista" : "7,50 € por persona"} />
            {selectedMatch.level && <InfoRow label="Nivel recomendado" value={selectedMatch.level} />}
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
        <div className="detail-cta-price">
          <strong>{esPista ? "24 €" : "7,50 €"}</strong>
          <small>{esPista ? "por pista" : "por persona"}</small>
        </div>
        <button className="detail-cta-btn">
          {esPista ? "Reservar ahora" : "Apuntarme ahora"} →
        </button>
      </div>
    </div>
  );
}

export default DetailScreen;
