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

const DAY_NAMES = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];

function DayStrip({ fecha, onFecha }) {
  const days = Array.from({ length: 8 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      iso: d.toISOString().slice(0, 10),
      label: i === 0 ? "Hoy" : DAY_NAMES[d.getDay()],
      num: d.getDate(),
    };
  });

  return (
    <div className="day-strip">
      <button
        className={`day-card${fecha === "all" ? " day-card--on" : ""}`}
        onClick={() => onFecha("all")}
      >
        <span className="day-label">Todos</span>
        <span className="day-num">·</span>
      </button>
      {days.map(({ iso, label, num }) => (
        <button
          key={iso}
          className={`day-card${fecha === iso ? " day-card--on" : ""}`}
          onClick={() => onFecha(iso)}
        >
          <span className="day-label">{label}</span>
          <span className="day-num">{num}</span>
        </button>
      ))}
    </div>
  );
}

const PUESTO_OPTS = [
  { value: "all",        label: "Cualquier posición" },
  { value: "Derecha",    label: "Derecha" },
  { value: "Revés",      label: "Revés" },
  { value: "Indiferente",label: "Indiferente" },
];

function SearchPanel({ fecha, onFecha, franja, onFranja, nivel, onNivel, niveles, mostrarNivel, puesto, onPuesto }) {
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
          <DayStrip fecha={fecha} onFecha={onFecha} />
        </div>
      </div>
      <div className="sp-row">
        <div className="sp-group">
          <small className="sp-label">Franja</small>
          <ChipRow options={franjaOpts} value={franja} onChange={onFranja} />
        </div>
      </div>
      {mostrarNivel && (
        <div className="sp-row">
          <div className="sp-group">
            <small className="sp-label">Puesto</small>
            <ChipRow options={PUESTO_OPTS} value={puesto} onChange={onPuesto} />
          </div>
        </div>
      )}
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
