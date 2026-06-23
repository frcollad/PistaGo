export default function ProfileScreen() {
  return (
    <>
      <header className="simple-header">
        <div>
          <h1>Perfil jugador</h1>
          <p>Configura tus zonas, nivel y preferencias de juego.</p>
        </div>
      </header>

      <section className="profile-content">
        <div className="profile-card">
          <div className="avatar">P</div>
          <div>
            <h2>Paco</h2>
            <p>Nivel aproximado 3-4 · Valencia</p>
          </div>
        </div>

        <div className="settings-list">
          <button>
            <span>📍</span>
            Mis zonas favoritas
            <strong>Valencia norte</strong>
          </button>

          <button>
            <span>📊</span>
            Mi nivel
            <strong>3-4</strong>
          </button>

          <button>
            <span>🔔</span>
            Alertas activas
            <strong>3 alertas</strong>
          </button>

          <button>
            <span>⭐</span>
            Clubes favoritos
            <strong>2 clubes</strong>
          </button>
        </div>
      </section>
    </>
  );
}