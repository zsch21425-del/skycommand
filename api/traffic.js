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
        lat = 34.85; lon = -82