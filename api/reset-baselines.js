// SkyCommand · Reset Baselines
//
// Wipes all stored baselines so the next /api/price-alert run reseeds from
// today's open. Useful at the start of each trading day or when changing
// the ticker list.
//
// Usage (curl):
//   curl -H "x-reset-secret: $RESET_SECRET" https://your-app.vercel.app/api/reset-baselines
//
// or via query param:
//   curl "https://your-app.vercel.app/api/reset-baselines?secret=$RESET_SECRET"
//
// If RESET_SECRET is not set in env, the endpoint refuses (do NOT leave it
// open — anyone hitting the URL could rearm your alerts).

import { kv } from '@vercel/kv';

const TICKERS = (process.env.ALERT_TICKERS || 'AAPL,MSFT,GOOGL,AMZN,TSLA,META')
  .split(',').map(s => s.trim()).filter(Boolean);

export default async function handler(req, res) {
  if (!process.env.RESET_SECRET) {
    return res.status(500).json({ error: 'RESET_SECRET not configured — refusing to run' });
  }
  const provided = req.headers['x-reset-secret'] || req.query?.secret;
  if (provided !== process.env.RESET_SECRET) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const cleared = [];
  for (const t of TICKERS) {
    await kv.del(`baseline:${t}`);
    cleared.push(t);
  }
  await kv.set('lastReset', { ts: Date.now(), cleared: cleared.length });

  return res.status(200).json({ ok: true, cleared });
}
