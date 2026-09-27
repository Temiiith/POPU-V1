# POPU — Sprint 4 Notes

## Synthetic Data Architecture

Sprint 4 introduces a provider boundary between POPU's agent/calculation services and epidemiological data.

### Current mode
- `synthetic_demo`
- Provider: `POPU Synthetic Scenario Provider`
- All configured scenarios are synthetic demonstration data.
- Missing disease/geography combinations return `DATA_UNAVAILABLE`.
- POPU never substitutes a different geography or disease to fill a missing scenario.

### Production boundary
`ProductionDataProvider` is intentionally not connected to a live public-health source. Future approved adapters can implement the same `EpidemiologyDataProvider` contract without rewriting the agent workflow.

Potential future adapters include SORMAS, DHIS2, laboratory systems, hospital/syndromic feeds, environmental/weather sources, and approved aggregate mobility sources. Their availability must be verified before being described as connected.

### Scientific/data-status rules
1. Synthetic data is visibly labelled.
2. Production data must not be fabricated or implied.
3. Administrative geography is separate from data availability.
4. Model output is separate from observed/derived data.
5. The LLM/agent does not invent numerical evidence.
6. Missing data is surfaced explicitly.
7. Human review remains required for operational interpretation.
