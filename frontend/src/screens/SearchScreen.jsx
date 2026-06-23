import { useState, useMemo } from "react";
import SearchPanel from "../components/SearchPanel";
import ResultCard from "../components/ResultCard";
import { usePistas } from "../hooks/usePistas";

const FRANJA_SHORT = { all: null, manana: "Mañana", tarde: "Tarde", noche: "Noche" };

function formatDateLabel(isoDate) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const today = new Date();
  const tom = new Date(); tom.setDate(today.getDate() + 1);
  if (y === today.getFullYear() && m === today.getMonth() + 1 && d === today.getDate()) return "Hoy";
  if (y === tom.getFullYear() && m === tom.getMonth() + 1 && d === tom.getDate()) return "Mañana";
  return `${d}/${m}`;
}

function horaEnFranja(strHora, franja) {
  if (franja === "all") return true;
  const [h] = strHora.split(":").map(Number);
  if (franja === "manana") return h >= 8 && h < 14;
  if (franja === "tarde")  return h >= 14 && h < 20;
  if (franja === "noche")  return h >= 20;
  return true;
}

function SearchScreen({ onShowDetail }) {
  const { alerts: pistas, loading, error } = usePistas();

  const [tab, setTab]         = useState("partidas");
  const [fecha, setFecha]     = useState("all");
  const [franja, setFranja]   = useState("all");
  const [nivel, setNivel]     = useState("all");
  const [panelOpen, setPanelOpen] = useState(false);

  const activeSummary = useMemo(() => {
    const parts = [];
    if (fecha !== "all") parts.push(formatDateLabel(fecha));
    if (franja !== "all") parts.push(FRANJA_SHORT[franja]);
    if (nivel !== "all") parts.push(nivel);
    return parts;
  }, [fecha, franja, nivel]);

  const hasFilters = activeSummary.length > 0;

  const niveles = useMemo(() => {
    const set = new Set(
      pistas.filter((p) => p.tipo === "partida_abierta" && p.nivel).map((p) => p.nivel)
    );
    return [...set].sort();
  }, [pistas]);

  const resultados = useMemo(() => {
    const ahora = Date.now();
    return pistas.filter((p) => {
      if (p.horaInicio <= ahora) return false;
      if (tab === "partidas" && p.color !== "green") return false;
      if (tab === "pistas"   && p.color !== "blue")  return false;
      if (fecha !== "all") {
        const d = new Date(p.horaInicio);
        const pistaISO = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        if (pistaISO !== fecha) return false;
      }
      if (!horaEnFranja(p.strHoraInicio, franja)) return false;
      if (nivel !== "all" && p.nivel !== nivel) return false;
      return true;
    });
  }, [pistas, tab, fecha, franja, nivel]);

  return (
    <>
      <header className="search-header">
        <div className="sh-top">
          <span className="sh-logo">Pista<span>Go</span></span>
          <button className="sh-bell">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
        </div>
        <p className="sh-sub">Encuentra dónde jugar hoy</p>
      </header>

      <div className="filter-bar" onClick={() => setPanelOpen((o) => !o)}>
        <span className="filter-bar-icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          Filtros
          {hasFilters && <span className="filter-dot" />}
        </span>
        <div className="filter-bar-chips">
          {activeSummary.length === 0
            ? <span className="filter-bar-hint">Sin filtros activos</span>
            : activeSummary.map((s) => <span key={s} className="filter-bar-chip">{s}</span>)
          }
        </div>
        <span className={`filter-chevron${panelOpen ? " open" : ""}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </span>
      </div>

      {panelOpen && (
        <div className="filter-panel-wrap">
          <SearchPanel
            fecha={fecha}   onFecha={setFecha}
            franja={franja} onFranja={setFranja}
            nivel={nivel}   onNivel={setNivel}
            niveles={niveles}
            mostrarNivel={tab === "partidas"}
          />
          <div className="filter-panel-footer">
            <button className="fp-clear" onClick={(e) => { e.stopPropagation(); setFecha("all"); setFranja("all"); setNivel("all"); }}>
              Limpiar
            </button>
            <button className="fp-apply" onClick={(e) => { e.stopPropagation(); setPanelOpen(false); }}>
              Ver {resultados.length} resultado{resultados.length !== 1 ? "s" : ""}
            </button>
          </div>
        </div>
      )}

      <div className="result-tabs">
        <button
          className={`rtab${tab === "partidas" ? " rtab--active" : ""}`}
          onClick={() => setTab("partidas")}
        >
          Partidas abiertas
        </button>
        <button
          className={`rtab${tab === "pistas" ? " rtab--active" : ""}`}
          onClick={() => setTab("pistas")}
        >
          Pistas libres
        </button>
      </div>

      <section className="screen-content search-results-content">
        <div className="result-count">
          {loading ? (
            <span className="rc-loading">Cargando…</span>
          ) : (
            <span><strong>{resultados.length}</strong> resultado{resultados.length !== 1 ? "s" : ""} encontrados</span>
          )}
          <button className="rc-sort">Ordenar ↕</button>
        </div>

        <div className="cards">
          {resultados.map((pista) => (
            <ResultCard key={pista.id} pista={pista} onShowDetail={onShowDetail} />
          ))}
        </div>

        {!loading && !error && resultados.length === 0 && (
          <p className="empty-msg">No hay resultados con estos filtros</p>
        )}
      </section>
    </>
  );
}

export default SearchScreen;
