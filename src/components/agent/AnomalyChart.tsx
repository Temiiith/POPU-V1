import React, { useState } from 'react';
import { AnomalyResult, AnomalyMethod } from '../../types/agent';
import { AnomalyService } from '../../services/anomalyService';

interface AnomalyChartProps {
  anomaly: AnomalyResult;
  onMethodChange?: (newAnomaly: AnomalyResult) => void;
}

export const AnomalyChart: React.FC<AnomalyChartProps> = ({ anomaly, onMethodChange }) => {
  const [selectedMethod, setSelectedMethod] = useState<AnomalyMethod>(anomaly.method);

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
  const maxVal = Math.max(...points.map(p => Math.max(p.observed, p.upperThreshold, p.baseline))) * 1.15;
  const chartHeight = 220;
  const chartWidth = 640;
  const paddingX = 45;
  const paddingY = 25;

  const getX = (index: number) => {
    return paddingX + (index / (points.length - 1)) * (chartWidth - paddingX * 2);
  };

  const getY = (val: number) => {
    return chartHeight - paddingY - (val / maxVal) * (chartHeight - paddingY * 2);
  };

  // Build SVG path for baseline
  const baselinePath = points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(p.baseline)}`)
    .join(' ');

  // Build SVG path for threshold
  const thresholdPath = points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(p.upperThreshold)}`)
    .join(' ');

  // Build SVG path for observed
  const observedPath = points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(p.observed)}`)
    .join(' ');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
      {/* Header & Method Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>DERIVED STATISTIC</span>
            <span aria-hidden="true">·</span>
            <span>{anomaly.disease}</span>
            <span aria-hidden="true">·</span>
            <span>{anomaly.geography}</span>
          </div>
          <h4 className="text-base font-semibold text-slate-100 mt-1">
            Statistical Anomaly Detection: Weekly Case Incidence
          </h4>
        </div>

        {/* Method Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-md border border-slate-800 shrink-0">
          {(['Z-score', 'EWMA', 'CUSUM', 'Rolling baseline', 'Seasonal baseline'] as AnomalyMethod[]).map(
            (m) => (
              <button
                key={m}
                onClick={() => handleSelectMethod(m)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  selectedMethod === m
                    ? 'bg-teal-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {m}
              </button>
            )
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-800/80">
        <div>
          <div className="text-xs uppercase font-mono text-slate-400">Observed Value</div>
          <div className="text-2xl font-mono font-semibold text-rose-400 mt-0.5">
            {anomaly.observedValue} <span className="text-xs font-normal text-slate-400">cases/wk</span>
          </div>
          <div className="text-xs text-rose-400/80 font-mono mt-0.5">+{anomaly.deviationPercent}% deviation</div>
        </div>

        <div>
          <div className="text-xs uppercase font-mono text-slate-400">Expected Baseline</div>
          <div className="text-2xl font-mono font-semibold text-slate-200 mt-0.5">
            {anomaly.expectedBaseline} <span className="text-xs font-normal text-slate-400">cases/wk</span>
          </div>
          <div className="text-xs text-slate-400 font-mono mt-0.5">Pre-surge median</div>
        </div>

        <div>
          <div className="text-xs uppercase font-mono text-slate-400">Standardized Z-Score</div>
          <div className="text-2xl font-mono font-semibold text-amber-400 mt-0.5">
            +{anomaly.zScore} <span className="text-xs font-normal text-slate-400">σ</span>
          </div>
          <div className="text-xs text-amber-400/80 font-mono mt-0.5">p &lt; 0.001 (critical)</div>
        </div>

        <div>
          <div className="text-xs uppercase font-mono text-slate-400">Signal Status</div>
          <div className="text-sm font-semibold text-rose-400 mt-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            {anomaly.status}
          </div>
          <div className="text-xs text-slate-400 font-mono mt-0.5">{anomaly.detectionDate}</div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="mt-4 relative overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto min-w-[540px] text-slate-500 overflow-visible"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = chartHeight - paddingY - pct * (chartHeight - paddingY * 2);
            const val = Math.round(pct * maxVal);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingX - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] font-mono fill-slate-400"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Anomaly threshold curve */}
          <path
            d={thresholdPath}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Baseline curve */}
          <path
            d={baselinePath}
            fill="none"
            stroke="#64748b"
            strokeWidth="1.5"
          />

          {/* Observed values curve */}
          <path
            d={observedPath}
            fill="none"
            stroke="#f43f5e"
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
                      ? 'fill-rose-500 stroke-slate-950 stroke-2'
                      : 'fill-slate-400 stroke-slate-900 stroke-1'
                  }
                />
                {/* X-axis tick labels */}
                {(idx % 2 === 0 || idx === points.length - 1) && (
                  <text
                    x={x}
                    y={chartHeight - 6}
                    textAnchor="middle"
                    className="text-[9px] font-mono fill-slate-400"
                  >
                    {pt.date.split(' ')[0]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-slate-800/60 text-xs font-mono">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-rose-500"></span>
              <span className="text-slate-300">Observed Cases</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-slate-400"></span>
              <span className="text-slate-400">Expected Baseline</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 border-b border-dashed border-amber-400"></span>
              <span className="text-amber-400">Anomaly Threshold ({selectedMethod})</span>
            </div>
          </div>

          <div className="text-[11px] text-amber-500/90 font-mono tracking-tight bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            SYNTHETIC DEMONSTRATION DATA
          </div>
        </div>
      </div>

      {/* Uncertainty Notice */}
      <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300 flex items-start gap-2.5">
        <span className="text-amber-400 font-mono shrink-0">UNCERTAINTY:</span>
        <span className="leading-relaxed">{anomaly.uncertainty}</span>
      </div>
    </div>
  );
};
