import ClubImage from "./ClubImage";

function MatchCard({ match }) {
  return (
    <article className="match-card">
      <ClubImage club={match.club} />

      <div className="match-info">
        <div className="card-top">
          <span className={`tag ${match.color}`}>{match.type}</span>
          <button>♡</button>
        </div>

        <h3>{match.club}</h3>
        <p>📍 {match.city}, Valencia</p>

        <div className="meta">
          <span>📅 {match.date}</span>
          <span>🕘 {match.time}</span>
        </div>

        <div className="level">
          <span>📊 {match.level}</span>
          <strong>· {match.spots}</strong>
        </div>
      </div>

      <button className="join-button">Unirme</button>
    </article>
  );
}

export default MatchCard;