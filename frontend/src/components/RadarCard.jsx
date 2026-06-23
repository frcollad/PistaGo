import ClubImage from "./ClubImage";

function RadarCard({ alert, distance, onShowDetail }) {
  return (
    <article className="radar-card">
      <ClubImage club={alert.club} />

      <div className="radar-info">
        <div className="card-top">
          <span className={`tag ${alert.color}`}>{alert.type}</span>
          <small>{alert.ago}</small>
        </div>

        <h3>{alert.title}</h3>
        <h4>{alert.club}</h4>

        <div className="radar-meta">
          <span>📍 {distance ? `${distance} · ${alert.city}` : alert.city}</span>
          <span>🏟️ {alert.info}</span>
          <span>📅 {alert.date}</span>
          <span>🕘 {alert.time}</span>
        </div>

        <button className="radar-button" onClick={onShowDetail}>
          {alert.button}
        </button>
      </div>
    </article>
  );
}

export default RadarCard;