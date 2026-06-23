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
    price: esPista ? "24 €" : "7,50 €",
    source: "TPC Matchpoint",
    color: pista.color,
  };

  return (
    <article className="result-card">
      <ClubImage club={pista.club} size={46} />

      <div className="rc-content">
        <div className="rc-header">
          <span className={`tag ${pista.color}`}>{pista.type}</span>
          <span className="rc-time">{pista.strHoraInicio}</span>
        </div>

        <h3 className="rc-club">{pista.club}</h3>
        <p className="rc-loc">📍 {pista.city}</p>

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
          <span className="rc-platform">⊞ TPC Matchpoint</span>
          <div className="rc-action">
            <div className="rc-price">
              {esPista ? "24 €" : "7,50 €"}
              <small>{esPista ? "por pista" : "p. persona"}</small>
            </div>
            <button
              className={`rc-btn rc-btn--${pista.color}`}
              onClick={() => onShowDetail(detail)}
            >
              {pista.button}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ResultCard;
