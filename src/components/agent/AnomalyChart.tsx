import React, { useState } from 'react';
import { AnomalyResult, AnomalyMethod } from '../../types/agent';
import { AnomalyService } from '../../services/anomalyService';

interface AnomalyChartProps {
  anomaly: AnomalyResult;
  onMethodChange?: (newAnomaly: AnomalyResult) => void;
}

export const AnomalyChart: React.FC<AnomalyChartProps> = ({
  anomaly,
  onMethodChange,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<AnomalyMethod>(
    anomaly.method
  );

  const handleSelectMethod = (method: AnomalyMethod) => {
    setSelectedMethod(method);

    const updated = AnomalyService.detectAnomaly({
      disease: anomaly.disease,
      geography: anomaly.geography,
      method,
    });

    if (onMethodChange) {
      onMethodChange(updated);
    }
  };

  const points = anomaly.timeSeries;

  if (!points || points.length < 2) {
    return (
      <div className="popu-surface rounded-2xl p-5">
        <div className="popu-label popu-mono">ANOMALY ANALYSIS</div>

        <h4 className="text-base font-semibold text-[var(--popu-text)] mt-1">
          Statistical Anomaly Detection
        </h4>

        <div className="mt-6 rounded-xl border border-[var(--popu-border)] bg-[var(--popu-muted)] p-5">
          <div className="text-sm font-semibold text-[var(--popu-text)]">
            Data unavailable
          </div>

          <p className="text-xs text-[var(--popu-sub)] mt-2">
            There is not enough time-series data available for this anomaly
            analysis.
          </p>

          <div className="mt-3 text-[11px] font-mono text-[var(--popu-warning)]">
            SYNTHETIC DEMONSTRATION DATA
          </div>
        </div>
      </div>
    );
  }

  const maxVal =
    Math.max(
      ...points.map((p) =>
        Math.max(p.observed, p.upperThreshold, p.baseline)
      )
    ) * 1.15;

  const chartHeight = 220;
  const chartWidth = 640;
  const paddingX = 45;
  const paddingY = 25;

  const getX = (index: number) => {
    return (
      paddingX +
      (index / (points.length - 1)) * (chartWidth - paddingX * 2)
    );
  };

  const getY = (val: number) => {
    return (
      chartHeight -
      paddingY -
      (val / maxVal) * (chartHeight - paddingY * 2)
    );
  };

  const baselinePath = points
    .map(
      (p, idx) =>
        `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(p.baseline)}`
    )
    .join(' ');

  const thresholdPath = points
    .map(
      (p, idx) =>
        `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(p.upperThreshold)}`
    )
    .join(' ');

  const observedPath = points
    .map(
      (p, idx) =>
        `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(p.observed)}`
    )
    .join(' ');

  return (
    <div className="popu-surface rounded-2xl p-5">
      {/* Header & Method Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--popu-border)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--popu-sub)]">
            <span>DERIVED STATISTIC</span>
            <span aria-hidden="true">·</span>
            <span>{anomaly.disease}</span>
            <span aria-hidden="true">·</span>
            <span>{anomaly.geography}</span>
          </div>

          <h4 className="text-base font-semibold text-[var(--popu-text)] mt-1">
            Statistical Anomaly Detection: Weekly Case Incidence
          </h4>
        </div>

        {/* Method Selector */}
        <div className="flex items-center gap-1 bg-[var(--popu-muted)] p-1 rounded-xl border border-[var(--popu-border)] shrink-0 overflow-x-auto">
          {(
            [
              'Z-score',
              'EWMA',
              'CUSUM',
              'Rolling baseline',
              'Seasonal baseline',
            ] as AnomalyMethod[]
          ).map((m) => (
            <button
              key={m}
              onClick={() => handleSelectMethod(m)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedMethod === m
                  ? 'bg-[var(--popu-teal)] text-[var(--popu-bg)] font-semibold shadow-sm'
                  : 'text-[var(--popu-sub)] hover:text-[var(--popu-text)] hover:bg-[var(--popu-surface)]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-[var(--popu-border)]">
        <div>
          <div className="popu-label popu-mono">Observed Value</div>

          <div className="text-2xl font-mono font-semibold text-[var(--popu-danger)] mt-0.5">
            {anomaly.observedValue}{' '}
            <span className="text-xs font-normal text-[var(--popu-sub)]">
              cases/wk
            </span>
          </div>

          <div className="text-xs text-[var(--popu-danger)] font-mono mt-0.5">
            +{anomaly.deviationPercent}% deviation
          </div>
        </div>

        <div>
          <div className="popu-label popu-mono">Expected Baseline</div>

          <div className="text-2xl font-mono font-semibold text-[var(--popu-text)] mt-0.5">
            {anomaly.expectedBaseline}{' '}
            <span className="text-xs font-normal text-[var(--popu-sub)]">
              cases/wk
            </span>
          </div>

          <div className="text-xs text-[var(--popu-sub)] font-mono mt-0.5">
            Pre-surge median
          </div>
        </div>

        <div>
          <div className="popu-label popu-mono">Standardized Z-Score</div>

          <div className="text-2xl font-mono font-semibold text-[var(--popu-warning)] mt-0.5">
            +{anomaly.zScore}{' '}
            <span className="text-xs font-normal text-[var(--popu-sub)]">
              σ
            </span>
          </div>

          <div className="text-xs text-[var(--popu-warning)] font-mono mt-0.5">
            p &lt; 0.001 (critical)
          </div>
        </div>

        <div>
          <div className="popu-label popu-mono">Signal Status</div>

          <div className="text-sm font-semibold text-[var(--popu-danger)] mt-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--popu-danger)] animate-pulse" />
            {anomaly.status}
          </div>

          <div className="text-xs text-[var(--popu-sub)] font-mono mt-0.5">
            {anomaly.detectionDate}
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="mt-4 relative overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto min-w-[540px] overflow-visible"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y =
              chartHeight -
              paddingY -
              pct * (chartHeight - paddingY * 2);

            const val = Math.round(pct * maxVal);

            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="var(--popu-border)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />

                <text
                  x={paddingX - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] font-mono fill-[var(--popu-sub)]"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Anomaly threshold */}
          <path
            d={thresholdPath}
            fill="none"
            stroke="var(--popu-warning)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Baseline */}
          <path
            d={baselinePath}
            fill="none"
            stroke="var(--popu-sub)"
            strokeWidth="1.5"
          />

          {/* Observed values */}
          <path
            d={observedPath}
            fill="none"
            stroke="var(--popu-danger)"
            strokeWidth="2.5"
          />

          {/* Data point markers */}
          {points.map((pt, idx) => {
            const x = getX(idx);
            const y = getY(pt.observed);

            return (
              <g key={idx} className="cursor-pointer group">
                <circle
                  cx={x}
                  cy={y}
                  r={pt.isAnomaly ? 5 : 3.5}
                  className={
                    pt.isAnomaly
                      ? 'fill-[var(--popu-danger)] stroke-[var(--popu-bg)] stroke-2'
                      : 'fill-[var(--popu-sub)] stroke-[var(--popu-surface)] stroke-1'
                  }
                />

                {(idx % 2 === 0 || idx === points.length - 1) && (
                  <text
                    x={x}
                    y={chartHeight - 6}
                    textAnchor="middle"
                    className="text-[9px] font-mono fill-[var(--popu-sub)]"
                  >
                    {pt.date.split(' ')[0]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-[var(--popu-border)] text-xs font-mono">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-[var(--popu-danger)]" />
              <span className="text-[var(--popu-text)]">
                Observed Cases
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-[var(--popu-sub)]" />
              <span className="text-[var(--popu-sub)]">
                Expected Baseline
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 border-b border-dashed border-[var(--popu-warning)]" />
              <span className="text-[var(--popu-warning)]">
                Anomaly Threshold ({selectedMethod})
              </span>
            </div>
          </div>

          <div className="text-[11px] text-[var(--popu-warning)] font-mono tracking-tight bg-[var(--popu-muted)] px-2 py-0.5 rounded-lg border border-[var(--popu-border)]">
            SYNTHETIC DEMONSTRATION DATA
          </div>
        </div>
      </div>

      {/* Uncertainty Notice */}
      <div className="mt-4 p-3 bg-[var(--popu-muted)] border border-[var(--popu-border)] rounded-xl text-xs text-[var(--popu-text)] flex items-start gap-2.5">
        <span className="text-[var(--popu-warning)] font-mono shrink-0">
          UNCERTAINTY:
        </span>

        <span className="leading-relaxed text-[var(--popu-sub)]">
          {anomaly.uncertainty}
        </span>
      </div>
    </div>
  );
};