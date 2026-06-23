async function discoverClub(base) {
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36';

  const r1 = await fetch(`${base}/Booking/Grid.aspx`, { headers: { 'User-Agent': ua } });
  const rawCookies = r1.headers.get('set-cookie') || '';
  const sessionCookie = rawCookies.match(/ASP\.NET_SessionId=[^;]+/)?.[0] || '';
  const html = await r1.text();
  const keyMatch = html.match(/\w+='([A-Za-z0-9+\/]{40,}={0,2})';/);
  const key = keyMatch?.[1];

  console.log(`\n${base}`);
  if (!key || !sessionCookie) { console.log('  ERROR: no session/key'); return; }

  const today = new Date();
  const fecha = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

  for (let id = 1; id <= 10; id++) {
    const res = await fetch(`${base}/booking/srvc.aspx/ObtenerCuadro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie,
        'Referer': `${base}/Booking/Grid.aspx`,
        'User-Agent': ua,
      },
      body: JSON.stringify({ idCuadro: id, fecha, key }),
    });
    const json = await res.json();
    if (json?.d?.Id && json.d.Id > 0) {
      console.log(`  cuadro ${id}: "${json.d.Nombre}" — ${json.d.Columnas?.length ?? 0} pistas`);
    }
  }
}

(async () => {
  await discoverClub('https://padelinterclubmeliana.matchpoint.com.es');
})().catch(console.error);
