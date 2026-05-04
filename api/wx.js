// SkyCommand weather proxy.
// Bypasses aviationweather.gov CORS limitations by relaying the request server-side.
// GET /api/wx?type=metar|taf|winds|airport&ids=KGMU
export default async function handler(req, res) {
  const type = String(req.query.type || '').toLowerCase();
  const ids  = String(req.query.ids  || 'KGMU').toUpperCase().replace(/[^A-Z0-9,]/g, '');
  let url;
  if (type === 'metar') {
    url = `https://aviationweather.gov/api/data/metar?ids=${encodeURIComponent(ids)}&format=json&hours=1`;
  } else if (type === 'taf') {
    url = `https://aviationweather.gov/api/data/taf?ids=${encodeURIComponent(ids)}&format=json`;
  } else if (type === 'winds') {
    url = `https://aviationweather.gov/api/data/windtemp?region=tot&fcst=06`;
  } else if (type === 'airport') {
    url = `https://aviationweather.gov/api/data/airport?ids=${encodeURIComponent(ids)}&format=json`;
  } else {
    res.status(400).json({ error: 'unknown type', allowed: ['metar','taf','winds','airport'] });
    return;
  }
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'SkyCommand/1.0 (https://skycommand-tau.vercel.app)' },
      redirect: 'follow'
    });
    const body = await r.text();
    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', r.headers.get('content-type') || (type === 'winds' ? 'text/plain' : 'application/json'));
    res.status(r.status).send(body);
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(502).json({ error: String(e && e.message || e) });
  }
}
