import { useState, useEffect } from "react";

const DIAS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES_ES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function formatFechaLegible(fechaStr) {
  const [d, m, y] = fechaStr.split("/").map(Number);
  const date = new Date(y, m - 1, d);
  const hoy = new Date();
  const manana = new Date();
  manana.setDate(hoy.getDate() + 1);
  if (date.toDateString() === hoy.toDateString()) return `Hoy, ${d} ${MESES_ES[m - 1]}.`;
  if (date.toDateString() === manana.toDateString()) return `Mañana, ${d} ${MESES_ES[m - 1]}.`;
  return `${DIAS_ES[date.getDay()]}, ${d} ${MESES_ES[m - 1]}.`;
}

function pistaToAlert(pista) {
  const esPista = pista.tipo === "pista_libre";
  return {
    id: pista.id,
    tipo: pista.tipo,
    type: esPista ? "PISTA LIBRE" : "PARTIDA ABIERTA",
    title: esPista
      ? `${pista.pista} libre · ${pista.strHoraInicio}`
      : `Partida ${pista.nivel || "abierta"} · ${pista.strHoraInicio}`,
    club: pista.club,
    city: pista.ciudad,
    lat: pista.lat,
    lng: pista.lng,
    date: formatFechaLegible(pista.fecha),
    time: `${pista.strHoraInicio} - ${pista.strHoraFin}`,
    info: esPista
      ? pista.pista
      : pista.plazasLibres != null
        ? `${pista.plazasLibres} plaza${pista.plazasLibres !== 1 ? "s" : ""} libre${pista.plazasLibres !== 1 ? "s" : ""}`
        : "Plazas disponibles",
    nivel: pista.nivel || null,
    plazasLibres: pista.plazasLibres,
    puesto: pista.puesto || null,
    ago: "En vivo",
    button: esPista ? "Reservar" : "Apuntarme",
    color: esPista ? "blue" : "green",
    horaInicio: pista.horaInicio,
    strHoraInicio: pista.strHoraInicio,
  };
}

export function usePistas() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    fetch("/pistas.json")
      .then((r) => r.json())
      .then((data) => {
        setAlerts((data.pistas || []).map(pistaToAlert));
        setUpdatedAt(data.updatedAt);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  return { alerts, loading, error, updatedAt };
}
