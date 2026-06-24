const fs = require("fs");
const path = require("path");

const CLUBS = [
  {
    id: "lapoblaindoor",
    nombre: "La Pobla Indoor",
    ciudad: "La Puebla de Farnals",
    lat: 39.5830,
    lng: -0.2830,
    baseUrl: "https://padellapoblaindoor.matchpoint.com.es",
    cuadros: [4],
  },
  {
    id: "bonpadel",
    nombre: "Bonpadel",
    ciudad: "Bonrepòs i Mirambell",
    lat: 39.5282,
    lng: -0.3660,
    baseUrl: "https://bonpadel.matchpoint.com.es",
    cuadros: [4],
  },
  {
    id: "interclubmeliana",
    nombre: "Interclub Meliana",
    ciudad: "Meliana",
    lat: 39.5373,
    lng: -0.3414,
    baseUrl: "https://padelinterclubmeliana.matchpoint.com.es",
    cuadros: [4],
  },
];

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36";

async function getSession(baseUrl) {
  const res = await fetch(`${baseUrl}/Booking/Grid.aspx`, {
    headers: { "User-Agent": UA },
  });
  const rawCookies = res.headers.get("set-cookie") || "";
  const sessionCookie = rawCookies.match(/ASP\.NET_SessionId=[^;]+/)?.[0] || "";
  const html = await res.text();
  const keyMatch = html.match(/\w+='([A-Za-z0-9+\/]{40,}={0,2})';/);
  const key = keyMatch?.[1];
  if (!key || !sessionCookie) throw new Error(`No session/key at ${baseUrl}`);
  return { sessionCookie, key };
}

function parseMsDate(dateStr) {
  const match = String(dateStr).match(/Date\((\d+)\)/);
  return match ? parseInt(match[1]) : null;
}

function formatFecha(date) {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function getFechas(dias = 3) {
  return Array.from({ length: dias }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

async function postJson(baseUrl, endpoint, body, sessionCookie) {
  const res = await fetch(`${baseUrl}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": sessionCookie,
      "Referer": `${baseUrl}/Booking/Grid.aspx`,
      "User-Agent": UA,
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

function parsePuestoFromLabels(labels) {
  const libres = labels.filter(l => l === "Libre").length;
  const ocupadas = labels.filter(l => l !== "Libre" && l !== "Reservado");
  // Si no hay ningún libre explícito pero tampoco 4 ocupados, inferimos que hay libres
  const totalLibres = libres > 0 ? libres : Math.max(0, 4 - labels.length);
  if (totalLibres === 0) return null;
  const posOcupadas = ocupadas
    .map(l => l.match(/\((Der|Rev|Ind)\)/)?.[1]).filter(Boolean);
  if (totalLibres >= 2) return "Indiferente";
  const hayDer = posOcupadas.includes("Der");
  const hayRev = posOcupadas.includes("Rev");
  if (hayDer && !hayRev) return "Revés";
  if (hayRev && !hayDer) return "Derecha";
  return "Indiferente";
}

async function getMatchesPuestos(baseUrl, sessionCookie, fechas) {
  const puestoMap = {};
  for (const fecha of fechas) {
    const dd = String(fecha.getDate()).padStart(2, "0");
    const mm = String(fecha.getMonth() + 1).padStart(2, "0");
    const yyyy = fecha.getFullYear();
    const fechaParam = `${dd}-${mm}-${yyyy}`;
    const fechaKey = `${parseInt(dd)}/${parseInt(mm)}/${yyyy}`;
    try {
      const res = await fetch(`${baseUrl}/Matches/Grid.aspx?fecha=${fechaParam}`, {
        headers: { "User-Agent": UA, "Cookie": sessionCookie },
      });
      const raw = await res.text();
      const h = raw.replace(/&amp;/g, "&");

      // Patrón 1: URL con idRecurso (partidas nuevas/vacías)
      const reIdR = /HyperLinkHorario[^"]*" href="[^"]*idRecurso=(\d+)[^"]*fecha=\d{2}-\d{2}-\d{4}[^"]*horainicio=(\d{1,2}:\d{2})/g;
      for (const m of h.matchAll(reIdR)) {
        const idRecurso = m[1];
        const hora = m[2];
        const labels = [...h.slice(m.index, m.index + 12000).matchAll(/LabelTexto[^>]*>([^<]+)</g)]
          .slice(0, 4).map(l => l[1].trim());
        const puesto = parsePuestoFromLabels(labels);
        if (puesto) puestoMap[`${idRecurso}|${fechaKey}|${hora}`] = puesto;
      }

      // Patrón 2: URL con GUID (partidas con jugadores ya inscritos)
      const reGuid = /HyperLinkHorario[^"]*" href="[^"]*id=[a-f0-9]{32}">(Pista \d+) (\d{1,2}:\d{2})<\/a>/g;
      for (const m of h.matchAll(reGuid)) {
        const pistaNombre = m[1];
        const hora = m[2];
        const labels = [...h.slice(m.index, m.index + 12000).matchAll(/LabelTexto[^>]*>([^<]+)</g)]
          .slice(0, 4).map(l => l[1].trim());
        const puesto = parsePuestoFromLabels(labels);
        if (puesto) puestoMap[`${pistaNombre}|${fechaKey}|${hora}`] = puesto;
      }
    } catch (e) {
      console.error(`  Error puestos ${fechaParam}:`, e.message);
    }
  }
  return puestoMap;
}

async function scrapeClub(club) {
  const ahora = Date.now();
  const pistas = [];

  const { sessionCookie, key } = await getSession(club.baseUrl);
  console.log(`  Session ok, key: ${key.substring(0, 20)}...`);

  const fechas = getFechas();
  const puestoMap = await getMatchesPuestos(club.baseUrl, sessionCookie, fechas);
  console.log(`  puestoMap: ${Object.keys(puestoMap).length} entradas`);

  for (const idCuadro of club.cuadros) {
    for (const fecha of getFechas()) {
      let data;
      try {
        const res = await postJson(
          club.baseUrl,
          "/booking/srvc.aspx/ObtenerCuadro",
          { idCuadro, fecha: formatFecha(fecha), key },
          sessionCookie
        );
        data = res.d;
      } catch (e) {
        console.error(`Error ${club.id} cuadro ${idCuadro} ${formatFecha(fecha)}:`, e.message);
        continue;
      }

      if (!data?.Columnas) continue;

      for (const columna of data.Columnas) {
        const ocupaciones = columna.Ocupaciones || [];

        for (const horario of columna.HorariosFijos || []) {
          const start = parseMsDate(horario.FechaHoraInicio);
          const end = parseMsDate(horario.FechaHoraFin);
          if (!start || !end || start < ahora) continue;

          const ocupado = ocupaciones.some((o) => {
            const oStart = parseMsDate(o.HoraInicio);
            const oEnd = parseMsDate(o.HoraFin);
            return oStart !== null && oEnd !== null && oStart < end && oEnd > start;
          });

          if (!ocupado) {
            pistas.push({
              id: `${club.id}-${columna.Id}-${start}`,
              clubId: club.id,
              club: club.nombre,
              ciudad: club.ciudad,
              lat: club.lat,
              lng: club.lng,
              pista: columna.TextoPrincipal,
              tipo: "pista_libre",
              fecha: formatFecha(fecha),
              strHoraInicio: horario.StrHoraInicio,
              strHoraFin: horario.StrHoraFin,
              horaInicio: start,
              horaFin: end,
              nivel: null,
              plazasLibres: null,
            });
          }
        }

        for (const ocupacion of ocupaciones) {
          if (ocupacion.Tipo !== "reserva_partida" || ocupacion.Color !== "#22C55E") continue;
          const start = parseMsDate(ocupacion.HoraInicio);
          const end = parseMsDate(ocupacion.HoraFin);
          if (!start || !end || start < ahora) continue;


          pistas.push({
            id: `${club.id}-partida-${columna.Id}-${start}`,
            clubId: club.id,
            club: club.nombre,
            ciudad: club.ciudad,
            lat: club.lat,
            lng: club.lng,
            pista: columna.TextoPrincipal,
            tipo: "partida_abierta",
            fecha: formatFecha(fecha),
            strHoraInicio: ocupacion.StrHoraInicio,
            strHoraFin: ocupacion.StrHoraFin,
            horaInicio: start,
            horaFin: end,
            nivel: ocupacion.Texto2 || null,
            plazasLibres: ocupacion.Texto1 ? parseInt(ocupacion.Texto1) : null,
            puesto: (() => {
              const h = ocupacion.StrHoraInicio.replace(/^0/, "");
              const f = formatFecha(fecha);
              return (
                puestoMap[`${columna.Id}|${f}|${h}`] ||
                puestoMap[`${columna.TextoPrincipal}|${f}|${h}`] ||
                null
              );
            })(),
          });
        }
      }
    }
  }

  return pistas;
}

async function main() {
  console.log("Scraping Matchpoint...");
  const todas = [];

  for (const club of CLUBS) {
    console.log(`\n${club.nombre}...`);
    const pistas = await scrapeClub(club);
    todas.push(...pistas);
    console.log(`  ${pistas.length} slots encontrados`);
  }

  todas.sort((a, b) => a.horaInicio - b.horaInicio);

  const out = path.join(__dirname, "../frontend/public/pistas.json");
  fs.writeFileSync(out, JSON.stringify({ updatedAt: Date.now(), pistas: todas }, null, 2));
  console.log(`\n✓ ${todas.length} slots guardados en frontend/public/pistas.json`);
}

main().catch(console.error);
