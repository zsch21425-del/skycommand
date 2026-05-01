// SkyCommand · Price Alert Cron Job
//
// Vercel serverless function. Triggered on a cron (see vercel.json).
// On each invocation: pull each ticker's current price from Finnhub,
// compare to the stored baseline, and SMS via Twilio if |change| ≥ ALERT_THRESHOLD.
//
// Required env vars (set in Vercel project → Settings → Environment Variables):
//   FINNHUB_KEY            – Finnhub API key (same one used by the Market Watch UI)
//   TWILIO_ACCOUNT_SID     – Twilio account SID
//   TWILIO_AUTH_TOKEN      – Twilio auth token
//   TWILIO_FROM            – Twilio phone number sending the SMS (E.164: +18005551234)
//   ALERT_TO_NUMBER        – your cell number (E.164)
//
// Optional env vars:
//   ALERT_TICKERS          – comma list, default "AAPL,MSFT,GOOGL,AMZN,TSLA,META"
//   ALERT_THRESHOLD        – percent (absolute), default "5"
//   RESET_SECRET           – shared secret for /api/reset-baselines (recommended)
//
// Storage: Vercel KV. Each ticker stores `baseline:<TICKER>` = { price, ts }.
// On first run a ticker has no baseline → it's seeded from today's open (q.o)
// and no SMS fires. On a triggered alert the baseline rolls forward to current
// price so we don't spam. /api/reset-baselines wipes them all (e.g. each
// morning before market open).

import { kv } from '@vercel/kv';

const TICKERS = (process.env.ALERT_TICKERS || 'AAPL,MSFT,GOOGL,AMZN,TSLA,META')
  .split(',').map(s => s.trim()).filter(Boolean);
const THRESHOLD = parseFloat(process.env.ALERT_THRESHOLD || '5');

async function fetchQuote(symbol) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${process.env.FINNHUB_KEY}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`finnhub ${symbol} HTTP ${r.status}`);
  return r.json(); // { c: current, pc: prev close, o: today open, h, l, t }
}

async function sendSMS(body) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;
  const to = process.env.ALERT_TO_NUMBER;
  if (!sid || !token || !from || !to) throw new Error('missing twilio env');

  const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
  const auth = Buffer.from(`${sid}:${token}`).toString('base64');
  const params = new URLSearchParams({ To: to, From: from, Body: body });
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });
  const txt = await r.text();
  if (!r.ok) throw new Error(`twilio ${r.status} ${txt}`);
  return JSON.parse(txt);
}

export default async function handler(req, res) {
  if (!process.env.FINNHUB_KEY) {
    return res.status(500).json({ error: 'missing FINNHUB_KEY' });
  }
  const triggered = [];
  const errors = [];
  const seeded = [];

  for (const ticker of TICKERS) {
    try {
      const q = await fetchQuote(ticker);
      const current = q?.c;
      if (!current) { errors.push({ ticker, error: 'no quote' }); continue; }

      const stored = await kv.get(`baseline:${ticker}`);
      const baseline = stored?.price ?? q.o ?? q.pc;

      if (!stored) {
        await kv.set(`baseline:${ticker}`, { price: baseline, ts: Date.now() });
        seeded.push({ ticker, baseline });
        continue;
      }

      const pct = ((current - baseline) / baseline) * 100;
      if (Math.abs(pct) >= THRESHOLD) {
        const dir = pct >= 0 ? '↑' : '↓';
        const msg = `SkyCommand alert: ${ticker} ${dir} ${pct.toFixed(2)}% — $${current.toFixed(2)} (baseline $${baseline.toFixed(2)})`;
        await sendSMS(msg);
        await kv.set(`baseline:${ticker}`, { price: current, ts: Date.now() });
        triggered.push({ ticker, pct, current, baseline });
      }
    } catch (e) {
      errors.push({ ticker, error: String(e?.message || e) });
    }
  }

  await kv.set('lastCheck', {
    ts: Date.now(),
    checked: TICKERS.length,
    triggered: triggered.length,
    errors: errors.length,
    seeded: seeded.length
  });

  return res.status(200).json({
    ok: true,
    checkedAt: new Date().toISOString(),
    threshold: THRESHOLD,
    tickers: TICKERS,
    triggered,
    seeded,
    errors
  });
}
