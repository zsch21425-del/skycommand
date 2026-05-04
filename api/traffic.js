// SkyCommand traffic proxy — adsb.lol (free, unlimited, no auth)
// Returns OpenSky-compatible shape so the existing client code keeps working.
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=20, stale-while-revalidate=60');
  try {
    let lat = parseFloat(req.query.lat);
    let lon = parseFloat(req.query.lon);
    let dist = parseFloat(req.query.dist) || 80;
    if (isNaN(lat) || isNaN(lon)) {
      const lamin = parseFloat(req.query.lamin);
      const lomin = parseFloat(req.query.lomin);
      const lamax = parseFloat(req.query.lamax);
      const lomax = parseFloat(req.query.lomax);
      if (isFinite(lamin) && isFinite(lomin) && isFinite(lamax) && isFinite(lomax)) {
        lat = (lamin + lamax) / 2;
        lon = (lomin + lomax) / 2;
        const dLat = (lamax - lamin) * 60;
        const dLon = (lomax - lomin) * 60 * Math.cos(lat * Math.PI / 180);
        dist = Math.max(dLat, dLon) / 2;
      } else {
        lat = 34.85; lon = -82.35; dist = 80;
      }
    }
    dist = Math.min(250, Math.max(10, dist));
    const url = 'https://api.adsb.lol/v2/lat/' + lat.toFixed(4) + '/lon/' + lon.toFixed(4) + '/dist/' + Math.round(dist);
    let r;
    try {
      r = await fetch(url, { headers: { 'User-Agent': 'SkyCommand/1.0', 'Accept': 'application/json' } });
    } catch (fetchErr) {
      res.status(502).json({ error: 'fetch_failed', detail: String((fetchErr && fetchErr.message) || fetchErr), states: [], source: 'adsb.lol' });
      return;
    }
    if (!r.ok) {
      const txt = await r.text().catch(function(){ return ''; });
      res.status(200).json({ error: 'upstream_' + r.status, detail: txt.slice(0,200), states: [], source: 'adsb.lol' });
      return;
    }
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    if (!ct.includes('json')) {
      const txt = await r.text().catch(function(){ return ''; });
      res.status(200).json({ error: 'non_json_response', contentType: ct, sample: txt.slice(0,200), states: [], source: 'adsb.lol' });
      return;
    }
    const j = await r.json();
    const acList = Array.isArray(j) ? j : (j.ac || j.aircraft || []);
    const states = (acList || []).filter(function(a){ return a && a.lat != null && a.lon != null; }).map(function(a){
      const altMeters = (a.alt_baro != null && a.alt_baro !== 'ground') ? Math.round(a.alt_baro * 0.3048) : null;
      return [
        a.hex || '',
        ((a.flight || a.r || '') + '').trim(),
        'US',
        Math.floor(Date.now()/1000),
        Math.floor(Date.now()/1000),
        a.lon,
        a.lat,
        altMeters,
        a.alt_baro === 'ground',
        a.gs != null ? a.gs * 0.514444 : null,
        a.track != null ? a.track : (a.true_heading != null ? a.true_heading : null),
        null, null, null, null, null, null, null
      ];
    });
    res.status(200).json({ time: Math.floor(Date.now()/1000), states: states, source: 'adsb.lol', count: states.length });
  } catch (e) {
    res.status(500).json({ error: 'handler_exception', detail: String((e && e.message) || e), states: [] });
  }
}
