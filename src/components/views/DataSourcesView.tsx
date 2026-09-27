import React from 'react';
import { Database, Link2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export const DataSourcesView: React.FC = () => {
  const adapters = [
    {
      id: 'sormas',
      name: 'SORMAS Adapter (Surveillance Outbreak Response Management & Analysis System)',
      standard: 'FHIR / REST v2.1',
      status: 'SYNTHETIC DEMO ACTIVE',
      targetCoverage: 'Weekly IDSR epidemiological notifications across 774 LGAs',
      futureEndpoint: 'POST /api/v1/adapters/sormas/sync',
      lastBatch: '1,420 weekly case encounters parsed',
    },
    {
      id: 'dhis2',
      name: 'DHIS2 Aggregate Tracker Adapter',
      standard: 'DHIS2 Web API / JSON',
      status: 'SYNTHETIC DEMO ACTIVE',
      targetCoverage: 'Routine health facility reporting completeness and baseline medians',
      futureEndpoint: 'POST /api/v1/adapters/dhis2/metrics',
      lastBatch: 'Monthly baseline tables synchronized',
    },
    {
      id: 'lims',
      name: 'NCDC Public Health Reference Laboratory Network (LIMS)',
      standard: 'HL7 v2.5.1 / ASTM',
      status: 'SYNTHETIC DEMO ACTIVE',
      targetCoverage: 'Microbiology culture isolation, serotyping, and rapid diagnostic tests',
      futureEndpoint: 'POST /api/v1/adapters/laboratory/ingest',
      lastBatch: 'Synthetic laboratory batch indexed',
    },
    {
      id: 'ehr',
      name: 'Sentinel Referral Hospital EHR Ingestion Gateway',
      standard: 'SMART on FHIR',
      status: 'SYNTHETIC DEMO ACTIVE',
      targetCoverage: 'Acute watery diarrhea (AWD) syndromic presentations & IV fluid consumption',
      futureEndpoint: 'POST /api/v1/adapters/ehr/admissions',
      lastBatch: 'Synthetic sentinel hospital feed available',
    },
    {
      id: 'meteo',
      name: 'Hydro-Meteorological Satellite Telemetry Adapter',
      standard: 'GeoTIFF / NetCDF / OGC API',
      status: 'SYNTHETIC DEMO ACTIVE',
      targetCoverage: 'Precipitation anomalies, surface water pooling, and river basin flood stages',
      futureEndpoint: 'POST /api/v1/adapters/environment/precip',
      lastBatch: 'Synthetic precipitation anomaly processed',
    },
    {
      id: 'mobility',
      name: 'Aggregated Inter-LGA Transport Mobility Feed',
      standard: 'GTFS / Anonymized Spatial Matrix',
      status: 'SYNTHETIC DEMO ACTIVE',
      targetCoverage: 'Market day congregation patterns and interstate arterial movement',
      futureEndpoint: 'POST /api/v1/adapters/mobility/matrix',
      lastBatch: 'Synthetic mobility indices updated',
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Disclaimer */}
      <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs font-mono text-amber-300">
        <span className="font-semibold uppercase tracking-wider">
          DATA SOURCE ADAPTER SPECIFICATION:
        </span>{' '}
        All data sources listed below currently operate via synthetic demonstration providers. The schema and interfaces
        are strictly typed to seamlessly connect with real Nigerian public health databases (SORMAS, DHIS2, reference labs)
        once production credentials and FastAPI microservices are deployed.
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
            <Database className="w-5 h-5 text-teal-400" />
            <span>Epidemiological Ingestion Adapters</span>
          </h2>
          <div className="text-xs text-slate-400 font-mono mt-0.5">
            Decoupled data layer architecture for multi-source surveillance integration
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded border border-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          <span>FastAPI Microservice Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {adapters.map((ad) => (
          <div
            key={ad.id}
            className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-semibold text-slate-100 text-sm">{ad.name}</h4>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">Protocol: {ad.standard}</div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30 shrink-0">
                {ad.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {ad.targetCoverage}
            </p>

            <div className="p-2.5 bg-slate-950 border border-slate-850 rounded font-mono text-[11px] space-y-1">
              <div className="text-slate-400">
                <span className="text-slate-500">Planned Endpoint:</span> {ad.futureEndpoint}
              </div>
              <div className="text-emerald-400/90">
                <span className="text-slate-500">Current Synthetic Batch:</span> {ad.lastBatch}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
