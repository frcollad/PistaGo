import { useState, useMemo } from "react";
import SearchPanel from "../components/SearchPanel";
import ResultCard from "../components/ResultCard";
import { usePistas } from "../hooks/usePistas";

function formatFechaStr(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

const FECHA_MAP = {
  hoy: formatFechaStr(0),
  manana: formatFechaStr(1),
  pasado: formatFechaStr(2),
};

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

  const [tab, setTab]       = useState("partidas");
  const [fecha, setFecha]   = useState("all");
  const [franja, setFranja] = useState("all");
  const [nivel, setNivel]   = useState("all");

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
        const pistaFecha = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        if (pistaFecha !== FECHA_MAP[fecha]) return false;
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

      <SearchPanel
        fecha={fecha}   onFecha={setFecha}
        franja={franja} onFranja={setFranja}
        nivel={nivel}   onNivel={setNivel}
        niveles={niveles}
        mostrarNivel={tab === "partidas"}
      />

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
