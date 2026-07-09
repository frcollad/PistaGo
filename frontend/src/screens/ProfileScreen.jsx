import { useState, useEffect } from "react";

function MatchpointCreds() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [hasCreds, setHasCreds] = useState(false);

  useEffect(() => {
    try {
      const c = JSON.parse(localStorage.getItem("mp_creds") || "null");
      if (c) { setEmail(c.email || ""); setPassword(c.password || ""); setHasCreds(true); }
    } catch {}
  }, []);

  function save() {
    localStorage.setItem("mp_creds", JSON.stringify({ email, password }));
    setHasCreds(true);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function clear() {
    localStorage.removeItem("mp_creds");
    setEmail(""); setPassword(""); setHasCreds(false);
  }

  return (
    <div className="mp-card">
      <div className="mp-card-header">
        <span className="mp-ball">🎾</span>
        <div>
          <strong>Cuenta Matchpoint</strong>
          <small>Para apuntarte automáticamente a partidas</small>
        </div>
        {hasCreds && <span className="mp-status">✓</span>}
      </div>
      <div className="mp-field">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          autoComplete="email"
        />
      </div>
      <div className="mp-field">
        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </div>
      <div className="mp-actions">
        {hasCreds && (
          <button className="mp-btn mp-btn--ghost" onClick={clear}>Borrar</button>
        )}
        <button
          className="mp-btn mp-btn--primary"
          onClick={save}
          disabled={!email || !password}
        >
          {saved ? "✓ Guardado" : "Guardar"}
        </button>
      </div>
      <p className="mp-notice">Las credenciales se guardan solo en este dispositivo.</p>
    </div>
  );
}

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

        <MatchpointCreds />

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
