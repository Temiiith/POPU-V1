import React from 'react';
import { Database } from 'lucide-react';

export const DataSourcesView: React.FC = () => {
  const adapters = [
    {
      id: 'sormas',
      name: 'SORMAS Adapter (Surveillance Outbreak Response Management & Analysis System)',
      standard: 'FHIR / REST v2.1',
      status: 'SYNTHETIC DEMO ACTIVE',
      targetCoverage:
        'Weekly IDSR epidemiological notifications across 774 LGAs',
      futureEndpoint: 'POST /api/v1/adapters/sormas/sync',
      lastBatch: '1,420 weekly case encounters parsed',
    },
    {
      id: 'dhis2',
      name: 'DHIS2 Aggregate Tracker Adapter',
      standard: 'DHIS2 Web API / JSON',
      status: 'SYNTHETIC DEMO ACTIVE',
      targetCoverage:
        'Routine health facility reporting completeness and baseline medians',
      futureEndpoint: 'POST /api/v1/adapters/dhis2/metrics',
      lastBatch: 'Monthly baseline tables synchronized',
    },
    {
      id: 'lims',
      name: 'NCDC Public Health Reference Laboratory Network (LIMS)',
      standard: 'HL7 v2.5.1 / ASTM',
      status: 'SYNTHETIC DEMO ACTIVE',
      targetCoverage:
        'Microbiology culture isolation, serotyping, and rapid diagnostic tests',
      futureEndpoint: 'POST /api/v1/adapters/laboratory/ingest',
      lastBatch: 'Synthetic laboratory batch indexed',
    },
    {
      id: 'ehr',
      name: 'Sentinel Referral Hospital EHR Ingestion Gateway',
      standard: 'SMART on FHIR',
      status: 'SYNTHETIC DEMO ACTIVE',
      targetCoverage:
        'Acute watery diarrhea (AWD) syndromic presentations & IV fluid consumption',
      futureEndpoint: 'POST /api/v1/adapters/ehr/admissions',
      lastBatch: 'Synthetic sentinel hospital feed available',
    },
    {
      id: 'meteo',
      name: 'Hydro-Meteorological Satellite Telemetry Adapter',
      standard: 'GeoTIFF / NetCDF / OGC API',
      status: 'SYNTHETIC DEMO ACTIVE',
      targetCoverage:
        'Precipitation anomalies, surface water pooling, and river basin flood stages',
      futureEndpoint: 'POST /api/v1/adapters/environment/precip',
      lastBatch: 'Synthetic precipitation anomaly processed',
    },
    {
      id: 'mobility',
      name: 'Aggregated Inter-LGA Transport Mobility Feed',
      standard: 'GTFS / Anonymized Spatial Matrix',
      status: 'SYNTHETIC DEMO ACTIVE',
      targetCoverage:
        'Market day congregation patterns and interstate arterial movement',
      futureEndpoint: 'POST /api/v1/adapters/mobility/matrix',
      lastBatch: 'Synthetic mobility indices updated',
    },
  ];

  return (
    <div className="popu-page p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">

      {/* Disclaimer */}
      <div className="p-3.5 bg-[var(--popu-muted)] border border-[var(--popu-border)] rounded-lg text-xs font-mono text-[var(--popu-warning)]">
        <span className="font-semibold uppercase tracking-wider">
          DATA SOURCE ADAPTER SPECIFICATION:
        </span>{' '}
        <span className="text-[var(--popu-sub)]">
          All data sources listed below currently operate via synthetic
          demonstration providers. The schema and interfaces are strictly typed
          to seamlessly connect with real Nigerian public health databases
          (SORMAS, DHIS2, reference labs) once production credentials and
          FastAPI microservices are deployed.
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--popu-text)] flex items-center gap-2.5">
            <Database className="w-5 h-5 text-[var(--popu-teal)]" />
            <span>Epidemiological Ingestion Adapters</span>
          </h2>

          <div className="text-xs text-[var(--popu-sub)] font-mono mt-0.5">
            Decoupled data layer architecture for multi-source surveillance
            integration
          </div>
        </div>

        <div className="text-xs font-mono text-[var(--popu-sub)] bg-[var(--popu-surface)] px-3 py-1.5 rounded-lg border border-[var(--popu-border)] flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-[var(--popu-teal)]" />
          <span>FastAPI Microservice Ready</span>
        </div>
      </div>

      {/* Adapter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {adapters.map((ad) => (
          <div
            key={ad.id}
            className="popu-surface rounded-2xl p-5 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h4 className="font-semibold text-[var(--popu-text)] text-sm">
                  {ad.name}
                </h4>

                <div className="text-[11px] font-mono text-[var(--popu-sub)] mt-0.5">
                  Protocol: {ad.standard}
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--popu-muted)] text-[var(--popu-teal)] border border-[var(--popu-border)] shrink-0">
                {ad.status}
              </span>
            </div>

            <p className="text-xs text-[var(--popu-sub)] leading-relaxed">
              {ad.targetCoverage}
            </p>

            <div className="p-2.5 bg-[var(--popu-muted)] border border-[var(--popu-border)] rounded-lg font-mono text-[11px] space-y-1">
              <div className="text-[var(--popu-sub)]">
                <span className="text-[var(--popu-sub)]/70">
                  Planned Endpoint:
                </span>{' '}
                {ad.futureEndpoint}
              </div>

              <div className="text-[var(--popu-teal)]">
                <span className="text-[var(--popu-sub)]/70">
                  Current Synthetic Batch:
                </span>{' '}
                {ad.lastBatch}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};