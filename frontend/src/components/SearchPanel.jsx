function Field({ icon, label, value }) {
  return (
    <div className="sp-field">
      <span className="sp-field-icon">{icon}</span>
      <div className="sp-field-text">
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
      <span className="sp-chevron">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </span>
    </div>
  );
}

const FECHA_LABELS = { all: "Cualquier día", hoy: "Hoy", manana: "Mañana", pasado: "Pasado mañana" };
const FRANJA_LABELS = { all: "Cualquier hora", manana: "Mañana (8-14h)", tarde: "Tarde (14-20h)", noche: "Noche (20-24h)" };

function ChipRow({ options, value, onChange }) {
  return (
    <div className="sp-chips">
      {options.map((o) => (
        <button
          key={o.value}
          className={`sp-chip${value === o.value ? " sp-chip--on" : ""}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function SearchPanel({ fecha, onFecha, franja, onFranja, nivel, onNivel, niveles, mostrarNivel }) {
  const fechaOpts = [
    { value: "all",    label: "Todos" },
    { value: "hoy",    label: "Hoy" },
    { value: "manana", label: "Mañana" },
    { value: "pasado", label: "Pasado" },
  ];
  const franjaOpts = [
    { value: "all",    label: "Cualquier hora" },
    { value: "manana", label: "Mañana" },
    { value: "tarde",  label: "Tarde" },
    { value: "noche",  label: "Noche" },
  ];
  const nivelOpts = [
    { value: "all", label: "Todos" },
    ...niveles.map((n) => ({ value: n, label: n })),
  ];

  return (
    <section className="search-panel">
      <div className="sp-row">
        <div className="sp-group">
          <small className="sp-label">Día</small>
          <ChipRow options={fechaOpts} value={fecha} onChange={onFecha} />
        </div>
      </div>
      <div className="sp-row">
        <div className="sp-group">
          <small className="sp-label">Franja</small>
          <ChipRow options={franjaOpts} value={franja} onChange={onFranja} />
        </div>
      </div>
      {mostrarNivel && niveles.length > 0 && (
        <div className="sp-row">
          <div className="sp-group">
            <small className="sp-label">Nivel</small>
            <ChipRow options={nivelOpts} value={nivel} onChange={onNivel} />
          </div>
        </div>
      )}
    </section>
  );
}

export default SearchPanel;
