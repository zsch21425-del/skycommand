// SkyCommand · Status
//
// Public read-only endpoint the dashboard polls to show the alerts state
// in the Market Watch panel ("Alerts: ON · last check 14:30 UTC").
// Does NOT expose secrets — only flags whether each piece is configured.

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');

  const last = await kv.get('lastCheck').catch(() => null);
  const lastReset = await kv.get('lastReset').catch(() => null);

  const cfg = {
    alertsEnabled: !!(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_FROM &&
      process.env.ALERT_TO_NUMBER &&
      process.env.FINNHUB_KEY
    ),
    threshold: parseFloat(process.env.ALERT_THRESHOLD || '5'),
    tickers: (process.env.ALERT_TICKERS || 'AAPL,MSFT,GOOGL,AMZN,TSLA,META')
      .split(',').map(s => s.trim()).filter(Boolean),
    lastCheck: last,
    lastReset
  };

  return res.status(200).json(cfg);
}
