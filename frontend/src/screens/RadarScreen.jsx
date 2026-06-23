import RadarCard from "../components/RadarCard";
import { usePistas } from "../hooks/usePistas";
import { useGeolocation } from "../hooks/useGeolocation";

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(km) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

function mapAlertToMatch(alert) {
  return {
    id: alert.id,
    type: alert.type,
    club: alert.club,
    city: alert.city,
    date: alert.date,
    time: alert.time,
    level: alert.info,
    spots:
      alert.type === "PARTIDA ABIERTA"
        ? "Quedan plazas disponibles"
        : "Pista disponible",
    price: alert.type === "PARTIDA ABIERTA" ? "7,50 €" : "24 €",
    source: "Matchpoint",
    color: alert.color,
  };
}

function RadarScreen({ onShowDetail }) {
  const { loading: geoLoading, error: geoError, coords } = useGeolocation();
  const { alerts, loading: pistasLoading, error: pistasError, updatedAt } = usePistas();

  const ahora = Date.now();
  const alertsWithDistance = alerts
    .filter((alert) => alert.horaInicio > ahora)
    .map((alert) => ({
      ...alert,
      distance: coords
        ? getDistanceKm(coords.lat, coords.lng, alert.lat, alert.lng)
        : null,
    }))
    .sort((a, b) =>
      a.distance !== null && b.distance !== null ? a.distance - b.distance : 0
    );

  const loading = geoLoading || pistasLoading;

  return (
    <>
      <header className="radar-hero">
        <div className="hero-top">
          <div>
            <h1>
              Radar <span>PistaGo</span>
            </h1>
            <p>
              Te avisamos cuando aparezca una pista o partida que{" "}
              <span>encaje contigo</span>
            </p>
          </div>
          <button className="round-button">🔔</button>
        </div>

        <div className="radar-visual">
          <div className="radar-circle radar-one"></div>
          <div className="radar-circle radar-two"></div>
          <div className="radar-circle radar-three"></div>
          <div className="radar-dot"></div>
          <div className="radar-line"></div>
        </div>

        <div className="radar-options">
          <button>🟢 Activadas</button>
          <button>📍 Mis zonas</button>
          <button>📊 Mi nivel</button>
        </div>
      </header>

      <section className="radar-content">
        {geoLoading && (
          <div className="location-status locating">
            <span>📡</span> Localizando tu posición…
          </div>
        )}

        {!geoLoading && geoError && (
          <div className="location-status error">
            <span>📍</span> {geoError} — mostrando todas las pistas
          </div>
        )}

        {!geoLoading && coords && (
          <div className="location-status found">
            <span>📍</span> Mostrando pistas cerca de ti
          </div>
        )}

        <div className="section-header-radar">
          <h2>Pistas cerca de ti</h2>
          {updatedAt && (
            <small className="updated-at">
              Actualizado {new Date(updatedAt).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
            </small>
          )}
        </div>

        {pistasLoading && (
          <div className="location-status locating">
            <span>⏳</span> Cargando pistas disponibles…
          </div>
        )}

        {pistasError && (
          <div className="location-status error">
            <span>⚠️</span> No se pudieron cargar las pistas
          </div>
        )}

        <div className="cards">
          {alertsWithDistance.map((alert) => (
            <RadarCard
              key={alert.id}
              alert={alert}
              distance={alert.distance !== null ? formatDistance(alert.distance) : null}
              onShowDetail={() => onShowDetail(mapAlertToMatch(alert))}
            />
          ))}
        </div>

        {!pistasLoading && !pistasError && alerts.length === 0 && (
          <p className="empty-state">No hay pistas libres en este momento</p>
        )}

        <button className="history-button">Ver historial de alertas →</button>
      </section>
    </>
  );
}

export default RadarScreen;
