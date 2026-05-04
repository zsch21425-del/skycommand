// SkyCommand stocks proxy — Finnhub
// GET /api/stock?symbol=SPY[&symbol=QQQ...]&token=USER_KEY
// or batch: /api/stock?symbols=SPY,QQQ,AAPL&token=...
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const token = String(req.query.token || '').trim();
  if (!token || !/^[A-Za-z0-9_-]{8,}$/.test(token)) {
    res.status(400).json({ error: 'Missing or invalid token query parameter' });
    return;
  }
  const symbolsRaw = String(req.query.symbols || req.query.symbol || '').toUpperCase();
  const symbols = symbolsRaw.split(',').map(s => s.trim()).filter(s => /^[A-Z0-9.\-]{1,10}$/.test(s));
  if (!symbols.length) {
    res.status(400).json({ error: 'Missing symbol(s) — pass &symbols=SPY,QQQ,...' });
    return;
  }
  try {
    const out = {};
    await Promise.all(symbols.map(async sym => {
      const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(sym)}&token=${encodeURIComponent(token)}`;
      try {
        const r = await fetch(url);
        const j = await r.json();
        if (j && (j.c || j.c === 0)) out[sym] = { c: j.c, pc: j.pc, d: j.d, dp: j.dp, h: j.h, l: j.l };
        else out[sym] = { error: j.error || 'no data' };
      } catch (e) {
        out[sym] = { error: String(e && e.message || e) };
      }
    }));
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    res.status(200).json(out);
  } catch (e) {
    res.status(502).json({ error: String(e && e.message || e) });
  }
}
