# POPU Sprint 2 — Investigation Engine & Data Availability

## Implemented
- Added an explicit scenario availability gate before disease-specific investigation tools execute.
- Unsupported disease + geography combinations now return DATA UNAVAILABLE rather than substituting another geography.
- Added data availability state to the Agent Workspace.
- Added an Edo State Dengue synthetic demonstration scenario.
- Kept synthetic data explicitly labelled and separated from geography availability.
- Removed remaining Renewal Model wording from forecast presentation/brief.

## Test scenarios
1. `Investigate the cholera signal in Edo State.` → synthetic investigation should execute.
2. `Investigate Lassa fever in Edo State.` → synthetic investigation should execute.
3. `Investigate dengue in Edo State.` → synthetic investigation should execute.
4. `Investigate cholera in Lagos State.` → DATA UNAVAILABLE; no Edo substitution.
5. `Investigate dengue in Kaduna State.` → DATA UNAVAILABLE; no substitution.

## Scientific boundary
A valid geography in the Nigeria catalogue does not imply that epidemiological data are available for that geography.
