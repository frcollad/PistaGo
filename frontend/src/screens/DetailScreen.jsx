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
      <text x="110" y="37" textAnchor="middle"
        fill={highlightLeft ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.2)"}
        fontSize="9" fontWeight="700" fontFamily="system-ui" letterSpacing="1">REVÉS</text>
      {highlightLeft && (
        <text x="110" y="90" textAnchor="middle" fill="rgba(34,197,94,0.95)" fontSize="12" fontWeight="800" fontFamily="system-ui">LIBRE</text>
      )}
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
  const hasMatchUrl = !esPista && !!selectedMatch.matchId;
  const hasWhatsapp = !!selectedMatch.whatsapp;
  const twoButtons = hasMatchUrl && hasWhatsapp;

  function openMatchpoint() {
    window.location.href = `${selectedMatch.baseUrl}/Matches/Join.aspx?id=${selectedMatch.matchId}`;
  }

  function openWhatsApp() {
    const puesto = selectedMatch.puesto ? ` (${selectedMatch.puesto})` : "";
    const msg = encodeURIComponent(
      `Hola! Quiero apuntarme a la partida del ${selectedMatch.date} a las ${selectedMatch.time}${puesto}. ¿Hay plaza? 🎾`
    );
    window.location.href = `https://wa.me/${selectedMatch.whatsapp}?text=${msg}`;
  }

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

        <div className="detail-notice">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>
            {hasMatchUrl
              ? "Se abrirá la web de Matchpoint en el navegador para confirmar tu inscripción."
              : `Al ${esPista ? "reservar" : "apuntarte"} saldrás a la plataforma del club para completar la reserva.`}
          </p>
        </div>

        <div style={{ height: twoButtons ? 126 : 90 }} />
      </div>

      {/* Sticky CTA */}
      <div className="detail-cta">
        <div className="detail-cta-stack">
          {hasMatchUrl && (
            <button className="detail-cta-btn" onClick={openMatchpoint}>
              Apuntarme en Matchpoint →
            </button>
          )}
          {hasWhatsapp && (
            <button className="detail-cta-btn detail-cta-btn--wa" onClick={openWhatsApp}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink:0}}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.112 1.523 5.837L.057 23.175a.75.75 0 0 0 .916.906l5.42-1.461A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.686-.527-5.208-1.437l-.375-.224-3.843 1.035 1.055-3.742-.247-.388A9.955 9.955 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              WhatsApp al club
            </button>
          )}
          {!hasMatchUrl && !hasWhatsapp && (
            <button className="detail-cta-btn">
              {esPista ? "Reservar en el club →" : "Apuntarme ahora →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailScreen;
