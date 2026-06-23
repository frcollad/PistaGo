import Logo from "../components/Logo";
import MatchCard from "../components/MatchCard";
import { quickFilters, matches } from "../data/mockData";

function HomeScreen({ onNavigate }) {
  return (
    <>
      <header className="hero">
        <div className="hero-top">
          <Logo />
          <button className="round-button">🔔</button>
        </div>

        <div className="hero-text">
          <h1>Encuentra dónde jugar hoy</h1>
          <p>
            Pistas, partidas y jugadores <span>cerca de ti</span>
          </p>
        </div>

        <div className="court-decoration">
          <div className="court-box"></div>
          <div className="court-middle"></div>
          <div className="court-horizontal"></div>
          <div className="court-ball"></div>
        </div>
      </header>

      <button className="search-entry" onClick={() => onNavigate("Buscar")}>
        <span>🔍</span>
        <span>Buscar pistas y partidas…</span>
      </button>

      <section className="home-content">
        <h2>Búsquedas rápidas</h2>

        <div className="chips">
          {quickFilters.map((filter, index) => (
            <button
              key={filter}
              className={index === 0 ? "chip active" : "chip"}
              onClick={() => onNavigate("Buscar")}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="section-header">
          <h2>🏁 Partidas abiertas cerca de ti</h2>
          <button onClick={() => onNavigate("Buscar")}>Ver todas</button>
        </div>

        <div>
          {matches.slice(0, 2).map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>
    </>
  );
}

export default HomeScreen;
