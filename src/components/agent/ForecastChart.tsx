import React from 'react';
import { ForecastResult } from '../../types/agent';

interface ForecastChartProps {
  forecast: ForecastResult;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ forecast }) => {
  const points = forecast.predictedValues;
  const chartHeight = 220;
  const chartWidth = 640;
  const paddingX = 45;
  const paddingY = 25;

  const maxVal = Math.max(
    ...points.map(p => Math.max(p.historical || 0, p.upperBound || 0, p.predicted || 0))
  ) * 1.15;

  const getX = (index: number) => {
    return paddingX + (index / (points.length - 1)) * (chartWidth - paddingX * 2);
  };

  const getY = (val: number) => {
    return chartHeight - paddingY - (val / maxVal) * (chartHeight - paddingY * 2);
  };

  // Split into historical and predicted indices
  const historicalPoints = points.filter(p => p.historical !== undefined);
  const futurePoints = points.filter(p => p.predicted !== undefined);

  // SVG path for historical observations
  const historicalPath = historicalPoints
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(p.historical || 0)}`)
    .join(' ');

  // Predicted mean path
  const startIndex = historicalPoints.length - 1;
  const connectionStart = historicalPoints[startIndex];
  
  const predictedPath = [
    `M ${getX(startIndex)} ${getY(connectionStart.historical || 0)}`,
    ...futurePoints.map((p, i) => `L ${getX(startIndex + 1 + i)} ${getY(p.predicted || 0)}`),
  ].join(' ');

  // Prediction interval polygon: upper curve forward, lower curve backwards
  const upperCoords = futurePoints.map((p, i) => `${getX(startIndex + 1 + i)},${getY(p.upperBound || 0)}`);
  const lowerCoordsReversed = [...futurePoints]
    .reverse()
    .map((p, i) => `${getX(startIndex + futurePoints.length - i)},${getY(p.lowerBound || 0)}`);

  const startCoord = `${getX(startIndex)},${getY(connectionStart.historical || 0)}`;
  const intervalPolygonPoints = [startCoord, ...upperCoords, ...lowerCoordsReversed].join(' ');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>MODEL OUTPUT</span>
            <span aria-hidden="true">·</span>
            <span>{forecast.modelName}</span>
            <span aria-hidden="true">·</span>
            <span>{forecast.modelVersion}</span>
          </div>
          <h4 className="text-base font-semibold text-slate-100 mt-1">
            Epidemiological Projection (14-Day Horizon with 95% Interval)
          </h4>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Generated:</span>
          <span className="text-slate-200">2026-09-24 12:00 UTC</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-800/80">
        <div>
          <div className="text-xs uppercase font-mono text-slate-400">Forecast Horizon</div>
          <div className="text-2xl font-mono font-semibold text-slate-100 mt-0.5">
            14 <span className="text-xs font-normal text-slate-400">days</span>
          </div>
          <div className="text-xs text-slate-400 font-mono mt-0.5">Daily projected incidence</div>
        </div>

        <div>
          <div className="text-xs uppercase font-mono text-slate-400">Forecast Score</div>
          <div className="text-2xl font-mono font-semibold text-rose-400 mt-0.5">
            {forecast.riskScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
          </div>
          <div className="text-xs text-rose-400/80 font-mono mt-0.5">Synthetic model score · not outbreak probability</div>
        </div>

        <div>
          <div className="text-xs uppercase font-mono text-slate-400">Expected Weekly Incidence</div>
          <div className="text-2xl font-mono font-semibold text-amber-400 mt-0.5">
            ~{forecast.expectedWeeklyTotal * 2} <span className="text-xs font-normal text-slate-400">cases</span>
          </div>
          <div className="text-xs text-amber-400/80 font-mono mt-0.5">Under status-quo contact rate</div>
        </div>

        <div>
          <div className="text-xs uppercase font-mono text-slate-400">Projected Peak Window</div>
          <div className="text-sm font-semibold text-slate-200 mt-1.5 font-mono">
            {forecast.expectedPeakDate}
          </div>
          <div className="text-xs text-slate-400 font-mono mt-0.5">Subject to WASH intervention</div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="mt-4 relative overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto min-w-[540px] text-slate-500 overflow-visible"
        >
          {/* Y Grid lines */}
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

          {/* Historical vs Forecast divider line */}
          <line
            x1={getX(startIndex)}
            y1={paddingY}
            x2={getX(startIndex)}
            y2={chartHeight - paddingY}
            stroke="#475569"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text
            x={getX(startIndex) + 4}
            y={paddingY + 12}
            className="text-[9px] font-mono fill-teal-400 font-semibold"
          >
            Today (Forecast Origin)
          </text>

          {/* Prediction Interval shaded polygon */}
          <polygon
            points={intervalPolygonPoints}
            fill="#0d9488"
            fillOpacity="0.18"
            stroke="none"
          />

          {/* Historical path */}
          <path
            d={historicalPath}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2.5"
          />

          {/* Projected mean path */}
          <path
            d={predictedPath}
            fill="none"
            stroke="#14b8a6"
            strokeWidth="2.5"
            strokeDasharray="5 4"
          />

          {/* Historical markers */}
          {historicalPoints.map((p, idx) => {
            const x = getX(idx);
            const y = getY(p.historical || 0);
            return (
              <circle
                key={`hist-${idx}`}
                cx={x}
                cy={y}
                r="3"
                className="fill-slate-300 stroke-slate-900 stroke-1"
              />
            );
          })}

          {/* Forecast markers */}
          {futurePoints.map((p, idx) => {
            const x = getX(startIndex + 1 + idx);
            const y = getY(p.predicted || 0);
            return (
              <circle
                key={`fut-${idx}`}
                cx={x}
                cy={y}
                r="3.5"
                className="fill-teal-400 stroke-slate-950 stroke-1.5"
              />
            );
          })}

          {/* X Axis dates */}
          {points.map((p, idx) => {
            if (idx % 3 !== 0 && idx !== points.length - 1 && idx !== startIndex) return null;
            const x = getX(idx);
            return (
              <text
                key={`lbl-${idx}`}
                x={x}
                y={chartHeight - 6}
                textAnchor="middle"
                className="text-[9px] font-mono fill-slate-400"
              >
                {p.date.split(' ')[0]}
              </text>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-slate-800/60 text-xs font-mono">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-slate-300"></span>
              <span className="text-slate-300">Historical Daily Observations</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 border-b border-dashed border-teal-400"></span>
              <span className="text-teal-400">Projected Trajectory (Deterministic Trend Projection)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-2 bg-teal-500/25 border border-teal-500/40 rounded-sm"></span>
              <span className="text-slate-400">95% Prediction Interval</span>
            </div>
          </div>

          <div className="text-[11px] text-amber-500/90 font-mono tracking-tight bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            SYNTHETIC DEMONSTRATION DATA
          </div>
        </div>
      </div>

      {/* Scientific Notice */}
      <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300 flex items-start gap-2.5">
        <span className="text-teal-400 font-mono shrink-0">MODEL NOTE:</span>
        <span className="leading-relaxed">
          Forecast outputs are produced by the numerical POPU forecasting service using the active synthetic scenario. The LLM does not generate numerical values or probabilities.
        </span>
      </div>
    </div>
  );
};
