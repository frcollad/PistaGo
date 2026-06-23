import ClubImage from "./ClubImage";

function ResultCard({ pista, onShowDetail }) {
  const esPista = pista.color === "blue";

  const detail = {
    id: pista.id,
    type: pista.type,
    club: pista.club,
    city: pista.city,
    date: pista.date,
    time: pista.time,
    level: pista.nivel,
    spots: pista.info,
    source: "TPC Matchpoint",
    color: pista.color,
  };

  return (
    <article className={`result-card result-card--${pista.color}`}>
      <ClubImage club={pista.club} size={54} />

      <div className="rc-content">
        <div className="rc-header">
          <span className={`tag ${pista.color}`}>{pista.type}</span>
          <span className="rc-time">{pista.strHoraInicio}</span>
        </div>

        <h3 className="rc-club">{pista.club}</h3>
        <p className="rc-loc">{pista.city}</p>

        {(pista.nivel || pista.plazasLibres != null) && (
          <p className="rc-meta">
            {pista.nivel && <span>{pista.nivel}</span>}
            {pista.nivel && pista.plazasLibres != null && <span> · </span>}
            {pista.plazasLibres != null && (
              <span>{pista.plazasLibres} plaza{pista.plazasLibres !== 1 ? "s" : ""} libre{pista.plazasLibres !== 1 ? "s" : ""}</span>
            )}
          </p>
        )}

        <div className="rc-footer">
          <span className="rc-date">{pista.date}</span>
          <button
            className={`rc-btn rc-btn--${pista.color}`}
            onClick={() => onShowDetail(detail)}
          >
            Ver detalles →
          </button>
        </div>
      </div>
    </article>
  );
}

export default ResultCard;
