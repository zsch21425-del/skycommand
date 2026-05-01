# ✈️ SkyCommand Dashboard — Personalization Handoff Guide

This document is your guide to customizing the **SkyCommand Cockpit Dashboard** with your own data. Share this with your AI assistant (Claude or otherwise) along with your personal info, and it can update the dashboard to reflect your real numbers, progress, and goals.

---

## 🗂️ What's in the Dashboard

| Soft Key | Panel | What It Does |
|----------|-------|--------------|
| **MKTW** | Market Watch | Two tabs: **PRICES** (6 ticker cards with mini sparkline charts) and **MARKET NEWS** (top 3 macro headlines via Finnhub `/news?category=general`) |
| **BGET** | Budget Control | Monthly income vs. expenses with visual bars and net savings |
| **CERT** | Flight Training | CFI & bizjet certification checklists with progress rings (Total, PIC, IFR, Night, XC) |
| **LGBK** | Digital Logbook | Add/view flight entries (date, aircraft, route, hours, remarks) |
| **WXOB** | Aviation Weather | Live METAR + TAF from aviationweather.gov for any ICAO |
| **ARPT** | Airport Information | Runways, frequencies (CTAF/Tower/Ground/ATIS/etc.), elevation, fuel, lat/lon, magvar — plus sunrise/sunset/civil twilight times with a sun-arc visualization |
| **TRFC** | Live Traffic | OpenSky Network states API (anonymous): aircraft within X nm of a chosen airport, shown as a cockpit-styled radar scope (amber dots + heading vectors) plus a target table sorted by distance |
| **NOTM** | NOTAMs / TFRs | Launches FAA's official NOTAM Search at notams.aim.faa.gov pre-filled with your airport + a button for the active TFR list at tfr.faa.gov + a pre-flight EFB checklist |
| **E6B** | Quick Calculations | Density altitude (PA + OAT), crosswind/headwind component (rwy hdg + wind), TAS from IAS using standard atmosphere |
| **CRNY** | Currency Tracker | BFR (24 mo), Medical (1st/2nd/3rd, age-aware), IPC (6 mo), one-time endorsements (HP, Complex, Tailwheel), and rolling 3-in-90 day/night takeoff/landing tracker. All saved to browser local storage. |
| **MEMO** | Pilot Notes | Freeform scratch pad that saves to browser storage |

All panels open from the cockpit instrument panel at the bottom of the screen. The background is an animated sunset sky view — like looking out the windshield of a Gulfstream or Citation.

### APIs Used (all free, no key required except where noted)

| Source | Used By | Key? |
|--------|---------|------|
| `aviationweather.gov/api/data/metar` and `/taf` | Weather panel | No |
| `aviationweather.gov/api/data/airport` | Airport Info panel + Traffic (for center coords) | No |
| `opensky-network.org/api/states/all` | Live Traffic panel | No (anonymous, low rate limit) |
| `api.sunrise-sunset.org/json` | Sun times in Airport Info panel | No |
| `notams.aim.faa.gov/notamSearch` | NOTAM panel (launches in new tab) | No |
| `tfr.faa.gov/tfr2/list.html` | TFR launch button | No |
| `finnhub.io/api/v1/quote` and `/news?category=general` | Market Watch prices and news | **Yes** — same key powers both |

---

## 📝 DATA TO FILL IN — Share This With Your AI

Paste the section below into a new chat with your AI and answer each item. The AI will update the dashboard code for you.

---

### 1. IDENTITY / CALLSIGN

```
What should your aircraft registration / callsign display say?
(Currently: N-529TF · SKYCOMMAND)

Your name or callsign: ________________________
```

---

### 2. STOCK PORTFOLIO TICKERS

List up to 6 stock tickers you want to watch. The dashboard starts in **demo mode** with simulated prices. To get live prices you'll need a free API key from [Finnhub.io](https://finnhub.io) or [Polygon.io](https://polygon.io).

```
Ticker 1: ______  (Company name: _____________)
Ticker 2: ______  (Company name: _____________)
Ticker 3: ______  (Company name: _____________)
Ticker 4: ______  (Company name: _____________)
Ticker 5: ______  (Company name: _____________)
Ticker 6: ______  (Company name: _____________)

Do you have a Finnhub or Polygon API key? Y / N
If yes, paste it here: ________________________
```

---

### 3. BUDGET — MONTHLY INCOME

```
Primary job / salary income (monthly): $__________
Side income (flight instruction, other): $__________
Other income: $__________
```

---

### 4. BUDGET — MONTHLY EXPENSES

```
Housing / Rent: $__________
Car payment / transportation: $__________
Insurance (health, auto, renters): $__________
Subscriptions (streaming, phone, etc.): $__________
Groceries: $__________
Dining out: $__________
Entertainment / fun: $__________
Miscellaneous: $__________

-- Flight Training Costs --
Flight hours (Hobbs rate × hours/month): $__________
Ground school / online courses: $__________
Books / study materials / ForeFlight: $__________
Medical exams / written test fees: $__________
```

---

### 5. FLIGHT TRAINING — CURRENT STATUS

Check all that apply and fill in hours:

```
Certificates & Ratings Earned:
[ ] Student Pilot Certificate
[ ] Private Pilot Certificate (PPL)
[ ] Instrument Rating (IR)
[ ] Commercial Certificate (CPL)
[ ] Multi-Engine Rating (ME)
[ ] CFI Certificate
[ ] CFII Rating
[ ] MEI Rating
[ ] ATP Certificate
[ ] Type Rating (specify: _________)
[ ] 1st Class Medical

Current Flight Hours:
Total time: _________ hrs
Pilot-in-Command (PIC): _________ hrs
Instrument (actual/simulated): _________ hrs
Night: _________ hrs
Cross-country: _________ hrs
Multi-engine: _________ hrs
Simulator/FTD: _________ hrs

Current training goal / next milestone:
_______________________________________________
```

---

### 6. LOGBOOK — RECENT FLIGHTS

Add any recent flights you want pre-loaded in the logbook:

```
Flight 1: Date: _____ Aircraft: _____ From: _____ To: _____ Hours: _____ Notes: _____
Flight 2: Date: _____ Aircraft: _____ From: _____ To: _____ Hours: _____ Notes: _____
Flight 3: Date: _____ Aircraft: _____ From: _____ To: _____ Hours: _____ Notes: _____
(Add as many as you like)
```

---

### 7. HOME AIRPORT & WEATHER

```
Home airport ICAO code (e.g., KORD, KGAI, KDFW): __________
Airport name: __________
City/State: __________
```

The weather panel currently shows demo data. To get **live METAR/TAF**, the AI can integrate the free [Aviation Weather API](https://aviationweather.gov/data/api/) using your home airport code.

---

### 8. RADIO STACK / HUD CUSTOMIZATION

The instrument panel shows radio frequencies and HUD data. You can customize these:

```
COM 1 frequency (your home ATIS or tower): __________
COM 2 frequency (ground/approach): __________
NAV 1 (ILS or VOR): __________
Transponder code: __________

HUD overlay — your typical cruise:
Altitude: __________
Heading: __________
Destination airport: __________
```

---

### 9. PILOT NOTES — PRE-LOADED TEXT

Do you want any study reminders, goals, or notes pre-loaded in the Notes panel?

```
Pre-load these notes:
________________________________________________
________________________________________________
________________________________________________
```

---

## 📲 TWILIO PRICE ALERTS — Vercel Cron + SMS

The dashboard ships with a serverless backend that texts you when a tracked ticker moves more than ±5% intraday. It runs every 15 minutes during US market hours (Mon–Fri, 13:00–20:00 UTC).

**Files:**

| File | Purpose |
|------|---------|
| `api/price-alert.js` | Cron-driven check — pulls quotes from Finnhub, compares to baseline, SMSes via Twilio when threshold hit |
| `api/reset-baselines.js` | Wipes stored baselines (re-arm at start of trading day). Protected by `RESET_SECRET` |
| `api/status.js` | Public read-only status the dashboard polls to show "ALERTS: ON · ±5% · LAST 14:30Z" |
| `vercel.json` | Cron schedule + function timeouts |
| `package.json` | Declares `@vercel/kv` dependency |

**Required env vars** (set in Vercel → Project → Settings → Environment Variables, or via CLI):

| Variable | Description |
|----------|-------------|
| `FINNHUB_KEY` | Your Finnhub API key (same one used by the Market Watch UI) |
| `TWILIO_ACCOUNT_SID` | Twilio account SID (starts `AC…`) |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_FROM` | Twilio phone number (E.164, e.g. `+18005551234`) |
| `ALERT_TO_NUMBER` | Your cell number (E.164) — Zach's: `+13522310096` |
| `RESET_SECRET` | Random string protecting `/api/reset-baselines` (set anything long) |

**Optional env vars:**

| Variable | Default |
|----------|---------|
| `ALERT_TICKERS` | `AAPL,MSFT,GOOGL,AMZN,TSLA,META` |
| `ALERT_THRESHOLD` | `5` (percent, absolute value) |

**One-time Vercel setup:**

```bash
# from the SkyCommand folder
npm install
vercel link               # connect to your Vercel project
vercel kv create skycommand-kv   # create a KV store
vercel env add FINNHUB_KEY production
vercel env add TWILIO_ACCOUNT_SID production
vercel env add TWILIO_AUTH_TOKEN production
vercel env add TWILIO_FROM production
vercel env add ALERT_TO_NUMBER production
vercel env add RESET_SECRET production
vercel deploy --prod
```

After deploy, the cron runs automatically. You can test once with:

```bash
curl https://your-app.vercel.app/api/price-alert
```

To re-arm baselines (e.g. each morning):

```bash
curl "https://your-app.vercel.app/api/reset-baselines?secret=YOUR_RESET_SECRET"
```

**How baselines work:** the first time the cron sees a ticker, it stores today's open as the baseline (no SMS fires). On every subsequent run it compares current price to baseline. When |change| ≥ threshold, an SMS fires AND the baseline rolls forward to the new price — so you don't get spammed every 15 min if the stock keeps drifting in the same direction. Reset wipes baselines so the next run reseeds from open.

The Market Watch panel shows live alert status pulled from `/api/status`. Locally (file://) it shows "ALERTS: NOT DEPLOYED".

---

## 🔧 HOW TO USE THIS WITH YOUR AI

1. **Copy this entire document** into a new chat (Claude, ChatGPT, etc.)
2. **Fill in your answers** above
3. **Ask the AI:** *"Please update the SkyCommand dashboard HTML file with all of my information from this handoff guide."*
4. The AI will produce an updated `.html` file with your data baked in
5. Save the file to your desktop and open it in any browser — no internet required (except for live stock/weather features)

---

## 🌐 LIVE DATA — STATUS

| Feature | Source | Status |
|---------|--------|--------|
| Stock prices | Finnhub `/quote` | Live with Finnhub key (demo otherwise) |
| Market news (top 3) | Finnhub `/news?category=general` | Live with Finnhub key (demo otherwise) |
| Aviation weather (METAR/TAF) | aviationweather.gov | Live, no key |
| Airport runways/freqs/elev | aviationweather.gov `/airport` | Live, no key |
| Sun times (sunrise/sunset/twilight) | api.sunrise-sunset.org | Live, no key |
| Live traffic / radar | OpenSky `/states/all` | Live, no key (anonymous, low rate limit) |
| NOTAMs | notams.aim.faa.gov | Launches public search (no scrape — official site) |
| TFRs | tfr.faa.gov | Launches public TFR list |
| Twilio price-alert SMS | Vercel cron + Twilio API | Requires deploy + env vars (see above) |

---

## 📁 FILE INFO

- **File:** `cockpit-dashboard.html`  
- **Open with:** Any web browser (Chrome, Firefox, Safari, Edge)  
- **No installation needed** — it's a single self-contained file  
- **Notes are saved** to your browser's local storage automatically  
- **Works offline** (except live stock/weather features)

---

*Built for a future CFI & private jet pilot. Clear skies ahead. 🛫*
