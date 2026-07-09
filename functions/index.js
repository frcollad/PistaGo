const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const nodeFetch = require("node-fetch");

initializeApp();

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

async function scrapeClub(club, db) {
  const ahora = Date.now();
  const nuevasPistas = [];

  const { sessionCookie, key } = await getSession(club.baseUrl);

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
            nuevasPistas.push({
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
              horaInicio: Timestamp.fromMillis(start),
              horaFin: Timestamp.fromMillis(end),
              nivel: null,
              plazasLibres: null,
              updatedAt: Timestamp.now(),
            });
          }
        }

        for (const ocupacion of ocupaciones) {
          if (ocupacion.Tipo !== "reserva_partida" || ocupacion.Color !== "#22C55E") continue;
          const start = parseMsDate(ocupacion.HoraInicio);
          const end = parseMsDate(ocupacion.HoraFin);
          if (!start || !end || start < ahora) continue;

          nuevasPistas.push({
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
            horaInicio: Timestamp.fromMillis(start),
            horaFin: Timestamp.fromMillis(end),
            nivel: ocupacion.Texto2 || null,
            plazasLibres: ocupacion.Texto1 ? parseInt(ocupacion.Texto1) : null,
            updatedAt: Timestamp.now(),
          });
        }
      }
    }
  }

  const col = db.collection("pistas");
  const existentes = await col.where("clubId", "==", club.id).get();
  const batch = db.batch();
  existentes.forEach((doc) => batch.delete(doc.ref));
  nuevasPistas.forEach((pista) => batch.set(col.doc(), pista));
  await batch.commit();

  console.log(`${club.nombre}: ${nuevasPistas.length} slots guardados`);
  return nuevasPistas.length;
}

async function runScraper() {
  const db = getFirestore();
  let total = 0;
  for (const club of CLUBS) {
    total += await scrapeClub(club, db);
  }
  return total;
}

exports.scrapePistasHttp = onRequest({ region: "europe-west1" }, async (req, res) => {
  try {
    const total = await runScraper();
    res.json({ ok: true, slots: total });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

exports.scrapePistas = onSchedule(
  { schedule: "every 30 minutes", region: "europe-west1", timeZone: "Europe/Madrid" },
  async () => { await runScraper(); }
);

// ── joinMatch ─────────────────────────────────────────────────────────────────

function parseCookiesFromResponse(response) {
  const setCookies = response.headers.raw()["set-cookie"] || [];
  const map = {};
  for (const c of setCookies) {
    const [pair] = c.split(";");
    const eq = pair.indexOf("=");
    if (eq === -1) continue;
    map[pair.slice(0, eq).trim()] = pair.slice(eq + 1);
  }
  return map;
}

function cookiesToHeader(cookieMap) {
  return Object.entries(cookieMap)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}

function extractHiddenField(html, name) {
  const escaped = name.replace(/\$/g, "\\$");
  const re = new RegExp(`name="${escaped}"[^>]*value="([^"]*)"`, "i");
  return (html.match(re) || [])[1] || "";
}

async function joinMatchFlow({ baseUrl, matchId, email, password, posicion, formaPago }) {
  let cookies = {};

  // Step 1: GET Login.aspx
  const loginGetRes = await nodeFetch(`${baseUrl}/Login.aspx`, {
    headers: { "User-Agent": UA },
    redirect: "follow",
  });
  cookies = { ...cookies, ...parseCookiesFromResponse(loginGetRes) };
  const loginHtml = await loginGetRes.text();

  const vs1  = extractHiddenField(loginHtml, "__VIEWSTATE");
  const vsg1 = extractHiddenField(loginHtml, "__VIEWSTATEGENERATOR");
  const ev1  = extractHiddenField(loginHtml, "__EVENTVALIDATION");

  if (!vs1) throw new Error("No se pudo leer Login.aspx (sin VIEWSTATE)");

  // Step 2: POST Login.aspx
  const loginParams = new URLSearchParams({
    "__EVENTTARGET": "",
    "__EVENTARGUMENT": "",
    "__VIEWSTATE": vs1,
    "__VIEWSTATEGENERATOR": vsg1,
    "__EVENTVALIDATION": ev1,
    "__tsFailed": "1",
    "ctl00$ScriptManager1": "",
    "ctl00$ContentPlaceHolderContenido$Login1$UserName": email,
    "ctl00$ContentPlaceHolderContenido$Login1$Password": password,
    "ctl00$ContentPlaceHolderContenido$Login1$LoginButton": "Entrar",
  });

  const loginPostRes = await nodeFetch(`${baseUrl}/Login.aspx`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": cookiesToHeader(cookies),
      "User-Agent": UA,
      "Referer": `${baseUrl}/Login.aspx`,
    },
    body: loginParams.toString(),
    redirect: "manual",
  });
  cookies = { ...cookies, ...parseCookiesFromResponse(loginPostRes) };

  const loginLocation = loginPostRes.headers.get("location") || "";
  if (loginPostRes.status !== 302 || loginLocation.toLowerCase().includes("login")) {
    const body = await loginPostRes.text();
    const serverErr = (body.match(/FailureText[^>]*>([^<]+)</) || [])[1];
    throw new Error(serverErr || "Credenciales incorrectas o Turnstile bloqueó el login");
  }

  // Step 3: GET Matches/Join.aspx?id={matchId}
  const joinGetRes = await nodeFetch(`${baseUrl}/Matches/Join.aspx?id=${matchId}`, {
    headers: { "Cookie": cookiesToHeader(cookies), "User-Agent": UA },
    redirect: "follow",
  });
  cookies = { ...cookies, ...parseCookiesFromResponse(joinGetRes) };
  const joinHtml = await joinGetRes.text();

  if (joinGetRes.url.toLowerCase().includes("login")) {
    throw new Error("Sesión caducada al cargar la partida");
  }

  const vs2  = extractHiddenField(joinHtml, "__VIEWSTATE");
  const vsg2 = extractHiddenField(joinHtml, "__VIEWSTATEGENERATOR");
  const ev2  = extractHiddenField(joinHtml, "__EVENTVALIDATION");

  if (!vs2) throw new Error("No se pudo leer Join.aspx (sin VIEWSTATE)");

  // Step 4: POST Join confirmation
  const joinParams = new URLSearchParams({
    "__EVENTTARGET": "ctl00$ContentPlaceHolderContenido$ButtonConfirmar",
    "__EVENTARGUMENT": "",
    "__VIEWSTATE": vs2,
    "__VIEWSTATEGENERATOR": vsg2,
    "__EVENTVALIDATION": ev2,
    "ctl00$ContentPlaceHolderContenido$WUCInformacionPartidaConfirmacion$DropDownListPosicion": posicion || "4",
    "ctl00$ContentPlaceHolderContenido$WUCInformacionPartidaConfirmacion$RadioButtonListFormaPago": formaPago || "pago_en_centro",
  });

  const joinPostRes = await nodeFetch(`${baseUrl}/Matches/Join.aspx?id=${matchId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": cookiesToHeader(cookies),
      "User-Agent": UA,
      "Referer": `${baseUrl}/Matches/Join.aspx?id=${matchId}`,
    },
    body: joinParams.toString(),
    redirect: "manual",
  });

  if (joinPostRes.status !== 302) {
    const errHtml = await joinPostRes.text();
    const errMsg = (errHtml.match(/LabelMensaje[^>]*>([^<]+)</) || [])[1]
      || (errHtml.match(/class="[^"]*error[^"]*"[^>]*>([^<]+)</) || [])[1]
      || "No se pudo confirmar la inscripción";
    throw new Error(errMsg);
  }

  return { ok: true, message: "¡Inscripción confirmada!" };
}

exports.joinMatch = onRequest({ region: "europe-west1", cors: true }, async (req, res) => {
  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { baseUrl, matchId, email, password, posicion, formaPago } = req.body;
  if (!baseUrl || !matchId || !email || !password) {
    return res.status(400).json({ error: "Faltan parámetros: baseUrl, matchId, email, password" });
  }

  try {
    const result = await joinMatchFlow({ baseUrl, matchId, email, password, posicion, formaPago });
    res.json(result);
  } catch (e) {
    console.error("joinMatch error:", e.message);
    res.status(400).json({ error: e.message });
  }
});
