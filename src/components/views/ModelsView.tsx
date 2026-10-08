import React, { useState } from 'react';
import { Cpu } from 'lucide-react';
import { AnomalyService } from '../../services/anomalyService';
import { AnomalyChart } from '../agent/AnomalyChart';
import { AnomalyResult } from '../../types/agent';
import StatusTag from '../ui/StatusTag';

export const ModelsView: React.FC = () => {
  const [anomaly, setAnomaly] = useState<AnomalyResult>(() =>
    AnomalyService.detectAnomaly({
      disease: 'Cholera',
      geography: 'Edo State',
      method: 'Z-score',
    })
  );

  const modelSpecs = [
    {
      name: 'Standardized Z-Score Deviation',
      category: 'Anomaly Detection',
      formula: 'Z = (X_t - μ_baseline) / σ_baseline',
      description:
        'Computes number of standard deviations the current week’s observation exceeds the pre-surge historical median. Flags a signal when the configured standardized deviation threshold is exceeded; significance depends on the data-generating process and validation context.',
      status: 'Implemented (TypeScript Service / FastAPI Ready)',
    },
    {
      name: 'EWMA (Exponentially Weighted Moving Average)',
      category: 'Anomaly Detection',
      formula: 'S_t = λ * X_t + (1 - λ) * S_{t-1}',
      description:
        'Applies geometric weighting (λ = 0.3) to historical observations to quickly catch persistent small upward shifts in disease transmission without excessive noise sensitivity.',
      status: 'Implemented (TypeScript Service / FastAPI Ready)',
    },
    {
      name: 'CUSUM (Cumulative Sum Control Chart)',
      category: 'Anomaly Detection',
      formula: 'C^+_t = max(0, C^+_{t-1} + (X_t - μ)/σ - k)',
      description:
        'Accumulates positive deviations from expected baseline. Useful for detecting persistent shifts in a time series; operational interpretation still requires epidemiological review.',
      status: 'Implemented (TypeScript Service / FastAPI Ready)',
    },
    {
      name: 'Deterministic Trend Projection',
      category: 'Forecasting',
      formula: 'Forecast_t = recent trend + baseline adjustment',
      description:
        'A transparent synthetic trend projection used for interface demonstration. It is not a validated transmission model and its score is not an outbreak probability.',
      status: 'Implemented (TypeScript Service / FastAPI Ready)',
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--popu-text)] flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-[var(--popu-teal)]" />
            <span>Mathematical &amp; Epidemiological Models</span>
          </h2>

          <div className="text-xs text-[var(--popu-sub)] font-mono mt-0.5">
            Deterministic statistical and forecasting engines powering POPU triage
          </div>
        </div>

        <div className="text-xs font-mono text-[var(--popu-warning)] bg-[var(--popu-muted)] px-3 py-1.5 rounded-lg border border-[var(--popu-border)]">
          STRICT DETERMINISTIC EXECUTION
        </div>
      </div>

      {/* Model Spec Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modelSpecs.map((model, idx) => (
          <div
            key={idx}
            className="popu-surface p-5 rounded-2xl space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[var(--popu-text)] text-sm">
                {model.name}
              </span>

              <StatusTag label={model.category} tone="teal" />
            </div>

            <div className="p-2 bg-[var(--popu-muted)] border border-[var(--popu-border)] rounded-lg font-mono text-xs text-[var(--popu-teal)]">
              {model.formula}
            </div>

            <p className="text-xs text-[var(--popu-sub)] leading-relaxed">
              {model.description}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-mono text-[var(--popu-sub)]">
                Backend Status:
              </span>

              <StatusTag label="Implemented" tone="teal" />
            </div>
          </div>
        ))}
      </div>

      {/* Live Anomaly Interactive Sandbox */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-[var(--popu-text)]">
          Interactive Algorithm Calibration
        </h3>

        <AnomalyChart
          anomaly={anomaly}
          onMethodChange={(updated) => setAnomaly(updated)}
        />
      </div>
    </div>
  );
};