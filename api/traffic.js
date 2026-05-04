// SkyCommand traffic proxy — OpenSky Network
// GET /api/traffic?lamin=...&lomin=...&lamax=...&lomax=...
export default async function handler(req, res) {
  const lamin = String(req.query.lamin || '32.85');
  const lomin = String(req.query.lomin || '-84.35');
  const lamax = String(req.query.lamax || '36.85');
  const lomax = String(req.query.lomax || '-80.35');
  const url = `https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'SkyCommand/1.0 (https://skycommand-tau.vercel.app)' }
    });
    const body = await r.text();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=20, stale-while-revalidate=60');
    res.setHeader('Content-Type', r.headers.get('content-type') || 'application/json');
    res.status(r.status).send(body);
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(502).json({ error: String(e && e.message || e) });
  }
}
