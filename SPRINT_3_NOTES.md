# POPU Sprint 3 — Nigeria Geography & Administrative Hierarchy

## Implemented
- Added a canonical Nigeria geography registry with Nigeria, all 36 states, and the FCT.
- Added stable geography IDs and parent-child relationships.
- Added a configured LGA registry for the synthetic demonstration layer (Edo State and FCT).
- Added geography availability helpers so administrative coverage is not confused with disease-data availability.
- Added explicit health-facility source status instead of inventing facility records.
- Added LGA resolution support for future natural-language geography parsing.
- Upgraded the Geography view into an interactive Nigeria → State/FCT → LGA → Health Facility hierarchy.
- Added per-state disease availability indicators for Cholera, Dengue, and Lassa fever.
- Preserved the rule: valid geography does not imply available epidemiological data.

## Scientific boundary
- The geography catalogue is administrative metadata.
- Synthetic epidemiological scenarios remain separate from the geography catalogue.
- A state or LGA without a configured source is shown as unavailable.
- Health-facility records are not fabricated.
