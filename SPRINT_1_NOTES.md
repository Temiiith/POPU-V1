# POPU Sprint 1 — Investigation State & Nigeria Geography

This snapshot continues from the uploaded `POPU-current.zip`.

## Changes in this sprint

- Removed the hidden Kwara State default from natural-language geography parsing.
- Added a Nigeria geography catalogue covering Nigeria, 36 states, and the FCT.
- Geography parsing now resolves supported state names instead of maintaining a short hard-coded list.
- An unspecified geography now resolves to `Nigeria` rather than silently selecting a synthetic state.
- The Agent Workspace no longer auto-runs an investigation on page load.
- The investigation input can start empty and uses an example placeholder.
- Forecast score is explicitly described as a synthetic model score and **not** an outbreak probability.
- Removed backward-compatible Kwara synthetic exports that could reintroduce stale state assumptions.
- Removed stale Kwara/Ilorin/SEIR wording from the active UI and model descriptions.
- Added a Geography page catalogue that distinguishes geography availability from epidemiological data availability.
- Existing synthetic scenarios remain explicitly synthetic; the current configured scenarios are still the ones defined in `src/mock/syntheticData.ts`.

## Important

This sprint does **not** fabricate surveillance data for every Nigerian state. A state can exist in the geography catalogue while its disease data source remains unavailable. POPU must not substitute another state's data.

## Verification note

The source was statically reviewed after modification. The Linux environment used for this artifact could not run the project's Windows `npm.cmd` workflow, and dependency installation timed out, so a fresh post-edit `npm run lint` / `npm run build` could not be independently completed in this environment. The last known Windows lint/build status from the working project before this snapshot was passing.
