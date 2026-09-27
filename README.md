# POPU — Epidemiological Intelligence

POPU is an AI-powered epidemiological intelligence demonstration for Nigeria. It coordinates a natural-language investigation workflow across surveillance, hospital, laboratory, environmental and geographic signals, then applies deterministic anomaly detection and forecasting services before producing an explainable, human-reviewable intelligence brief.

> **SYNTHETIC DEMONSTRATION DATA** — This frontend is a demonstration environment. It does not claim a live production epidemiological feed and must not be used for official clinical or public-health action.

## Competition demo

Use the Agent Workspace and run:

`Investigate the cholera signal in Edo State.`

The demo shows the investigation plan, tool execution, observed/derived/modelled evidence, anomaly detection, 14-day trend projection, uncertainty, recommendations and the mandatory human-review gate.

## Data boundary

The active provider is `POPU Synthetic Scenario Provider`. The production provider boundary exists but is intentionally not connected. Future adapters can implement the same contract for approved SORMAS, DHIS2, laboratory, hospital, environmental/weather and aggregate mobility sources. POPU never substitutes another geography when data are unavailable.

## Local development

```powershell
npm.cmd install
npm.cmd run lint
npm.cmd run build
npm.cmd run dev
```

Open `http://localhost:3000`.

## Vercel deployment

1. Push this project to GitHub.
2. Import the repository into Vercel.
3. Vercel will use `npm run build` and publish `dist/`.
4. No production API key is required for the synthetic demo.

The included `vercel.json` keeps the SPA routing pointed at `index.html`.

## Scope

POPU is designed as an intelligence layer alongside existing public-health systems, not as a replacement for surveillance systems. Numerical anomaly and forecast outputs come from deterministic services; the agent orchestrates and explains those outputs. Human review remains mandatory.
