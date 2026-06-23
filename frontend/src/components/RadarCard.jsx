import ClubImage from "./ClubImage";

function RadarCard({ alert, distance, onShowDetail }) {
  return (
    <article className={`result-card result-card--${alert.color}`}>
      <ClubImage club={alert.club} size={44} />

      <div className="rc-content">
        <div className="rc-header">
          <span className={`tag ${alert.color}`}>{alert.type}</span>
          <span className="rc-time">{alert.time?.split(" - ")[0]}</span>
        </div>

        <h3 className="rc-club">{alert.club}</h3>
        <p className="rc-loc">
          {distance ? `${distance} · ` : ""}{alert.city}
        </p>

        {(alert.nivel || alert.info) && (
          <p className="rc-meta">
            {alert.nivel && <span>{alert.nivel}</span>}
            {alert.nivel && alert.info && <span> · </span>}
            {alert.info && <span>{alert.info}</span>}
          </p>
        )}

        <div className="rc-footer">
          <span className="rc-date">{alert.date}</span>
          <button
            className={`rc-btn rc-btn--${alert.color}`}
            onClick={onShowDetail}
          >
            Ver detalles →
          </button>
        </div>
      </div>
    </article>
  );
}

export default RadarCard;
