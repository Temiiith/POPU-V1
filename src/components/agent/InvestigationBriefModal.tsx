import React, { useState } from 'react';
import {
  RiskAssessment,
  AnomalyResult,
  ForecastResult,
  EvidenceItem,
  UncertaintyAnalysis,
  RecommendationAction,
  AIInterpretation,
  InvestigationTrace,
} from '../../types/agent';
import { X, Download, Copy, Check, FileText, AlertTriangle, ShieldCheck } from 'lucide-react';

interface InvestigationBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  disease: string;
  geography: string;
  riskAssessment: RiskAssessment | null;
  anomaly: AnomalyResult | null;
  forecast: ForecastResult | null;
  evidence: EvidenceItem[];
  uncertainty: UncertaintyAnalysis | null;
  aiInterpretation: AIInterpretation | null;
  recommendations: RecommendationAction[];
  trace: InvestigationTrace | null;
}

export const InvestigationBriefModal: React.FC<InvestigationBriefModalProps> = ({
  isOpen,
  onClose,
  disease,
  geography,
  riskAssessment,
  anomaly,
  forecast,
  evidence,
  uncertainty,
  aiInterpretation,
  recommendations,
  trace,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    const briefText = generateTextBrief();
    navigator.clipboard.writeText(briefText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const briefText = generateTextBrief();
    const blob = new Blob([briefText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `POPU_Epidemiological_Brief_${disease}_${geography.replace(/\s+/g, '_')}_2026.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateTextBrief = () => {
    return `# EPIDEMIOLOGICAL INVESTIGATION BRIEF
**System**: POPU AI Epidemiological Intelligence Agent
**Disease**: ${disease}
**Geography**: ${geography}
**Status**: ${riskAssessment?.investigationStatus || 'Requires investigation'}
**Signal Status**: ${riskAssessment?.signalStatus || 'Elevated signal'}
**Date Generated**: ${new Date().toISOString()}
**Notice**: SYNTHETIC DEMONSTRATION DATA - NOT FOR OFFICIAL CLINICAL ACTION

---

## 1. SIGNAL SUMMARY & RISK ASSESSMENT
${riskAssessment?.rationale || 'N/A'}
- Forecast Score: ${forecast?.riskScore ?? 'N/A'}/100 (synthetic model score; not an outbreak probability)
- Forecast Horizon: ${forecast?.forecastHorizonDays || 14} days
- Human Review: STRICTLY REQUIRED PRIOR TO FIELD ACTION

---

## 2. STATISTICAL ANOMALY ANALYSIS
- Method: ${anomaly?.method || 'Z-score'}
- Observed Incidence: ${anomaly?.observedValue ?? 'N/A'} cases/week
- Expected Baseline: ${anomaly?.expectedBaseline ?? 'N/A'} cases/week
- Standardized Deviation: ${anomaly?.zScore !== undefined ? `${anomaly.zScore >= 0 ? '+' : ''}${anomaly.zScore}` : 'N/A'} σ (${anomaly?.deviationPercent !== undefined ? `${anomaly.deviationPercent >= 0 ? '+' : ''}${anomaly.deviationPercent.toFixed(1)}` : 'N/A'}%)
- Status: ${anomaly?.status || 'Elevated Signal Detected'}

---

## 3. 14-DAY FORECAST PROJECTION
- Model: ${forecast?.modelName || 'Forecast model unavailable'} (${forecast?.modelVersion})
- Interval: ${forecast?.predictionInterval}
- Trend: ${forecast?.trend}
- Projected Peak: ${forecast?.expectedPeakDate}

---

## 4. MULTI-MODAL EVIDENCE INVENTORY
${evidence
  .map(
    e =>
      `- [${e.category}] ${e.metric}: ${e.value} (${e.label}) | Source: ${e.source} | Baseline: ${e.baselineComparison || 'N/A'}`
  )
  .join('\n')}

---

## 5. UNCERTAINTY & LIMITATIONS
- Data Completeness: ${uncertainty?.dataCompletenessScore ?? 'N/A'}%
- Missing Information:
${(uncertainty?.missingDataItems || []).map(m => `  * ${m}`).join('\n')}
- Limitations:
${(uncertainty?.modelLimitations || []).map(l => `  * ${l}`).join('\n')}

---

## 6. RECOMMENDED PUBLIC HEALTH ACTIONS (HUMAN REVIEW REQUIRED)
${recommendations
  .map(
    r =>
      `${r.order}. [${r.urgency}] ${r.action}\n   Owner: ${r.owner}\n   Note: ${r.operationalNote}`
  )
  .join('\n')}

---
**Audit Trace ID**: ${trace?.investigationId || 'N/A'}
**Disclaimer**: This document is an AI-assisted synthesis of synthetic surveillance signals. All interventions require formal authorization by the State Epidemiologist.
`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                Epidemiological Investigation Brief
              </h3>
              <div className="text-xs text-slate-400 font-mono">
                {disease} · {geography} · Status: {riskAssessment?.investigationStatus}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 text-xs font-medium text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-md flex items-center gap-1.5 font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded-md hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-200">
          {/* Synthetic Demo Warning */}
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-3 text-xs text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold uppercase tracking-wider font-mono">
                SYNTHETIC DEMONSTRATION DATA:
              </span>{' '}
              The epidemiological metrics, laboratory positives, and hospital figures in this brief are
              algorithmically generated for demonstration and evaluation purposes. They do not constitute official
              verified statistics for any Nigerian jurisdiction.
            </div>
          </div>

          {/* Section 1: Executive Signal Summary */}
          <div className="border border-slate-800 rounded-lg p-4 bg-slate-950/60">
            <h4 className="text-xs uppercase font-mono tracking-wider text-teal-400 font-semibold mb-2">
              1. Signal Summary & Risk Assessment
            </h4>
            <p className="text-slate-300 leading-relaxed text-sm">
              {riskAssessment?.rationale}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-800/80 font-mono text-xs">
              <div>
                <span className="text-slate-400 block">Signal Level</span>
                <span className="text-rose-400 font-semibold">{riskAssessment?.signalStatus}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Forecast Horizon</span>
                <span className="text-slate-200 font-semibold">14 Days</span>
              </div>
              <div>
                <span className="text-slate-400 block">Forecast Score</span>
                <span className="text-amber-400 font-semibold">{forecast?.riskScore ?? 'N/A'}/100</span>
              </div>
              <div>
                <span className="text-slate-400 block">Human Review</span>
                <span className="text-teal-400 font-semibold">MANDATORY</span>
              </div>
            </div>
          </div>

          {/* Section 2: Anomaly & Forecast Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-800 rounded-lg p-4 bg-slate-950/60">
              <h4 className="text-xs uppercase font-mono tracking-wider text-teal-400 font-semibold mb-2">
                2. Anomaly Analysis
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-400">Method</span>
                  <span className="text-slate-200">{anomaly?.method}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-400">Observed Value</span>
                  <span className="text-rose-400 font-semibold">{anomaly?.observedValue} cases/wk</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-400">Expected Baseline</span>
                  <span className="text-slate-300">{anomaly?.expectedBaseline} cases/wk</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Standardized Z-Score</span>
                  <span className="text-amber-400 font-semibold">+{anomaly?.zScore} σ (p &lt; 0.001)</span>
                </div>
              </div>
            </div>

            <div className="border border-slate-800 rounded-lg p-4 bg-slate-950/60">
              <h4 className="text-xs uppercase font-mono tracking-wider text-teal-400 font-semibold mb-2">
                3. Deterministic Trend Forecasting (14-Day Horizon)
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-400">Model Name</span>
                  <span className="text-slate-200">{forecast?.modelName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-400">Prediction Interval</span>
                  <span className="text-teal-300">{forecast?.predictionInterval}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-400">Trajectory Velocity</span>
                  <span className="text-rose-400 capitalize">{forecast?.trend.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Expected Peak Date</span>
                  <span className="text-slate-200">{forecast?.expectedPeakDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Evidence Matrix Table */}
          <div className="border border-slate-800 rounded-lg p-4 bg-slate-950/60">
            <h4 className="text-xs uppercase font-mono tracking-wider text-teal-400 font-semibold mb-3">
              4. Multi-Modal Evidence Inventory
            </h4>
            <div className="space-y-2.5">
              {evidence.map(e => (
                <div
                  key={e.id}
                  className="p-2.5 bg-slate-900 border border-slate-800 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-teal-400 font-semibold">{e.category}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-300">{e.geography}</span>
                    </div>
                    <div className="font-medium text-slate-100 mt-0.5">{e.metric}</div>
                  </div>
                  <div className="sm:text-right font-mono">
                    <div className="text-teal-300 font-semibold">{e.value}</div>
                    <div className="text-[10px] text-slate-400">{e.baselineComparison}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Uncertainty & Limitations */}
          <div className="border border-slate-800 rounded-lg p-4 bg-slate-950/60">
            <h4 className="text-xs uppercase font-mono tracking-wider text-amber-400 font-semibold mb-2">
              5. Uncertainty & Data Limitations
            </h4>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              {uncertainty?.predictionIntervalDescription}
            </p>
            <div className="space-y-1.5 text-xs text-slate-400">
              {uncertainty?.missingDataItems.map((m, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400">·</span>
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Recommended Investigation Actions */}
          <div className="border border-slate-800 rounded-lg p-4 bg-slate-950/60">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs uppercase font-mono tracking-wider text-teal-400 font-semibold">
                6. Recommended Investigation Actions
              </h4>
              <span className="text-[11px] font-mono text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                HUMAN REVIEW REQUIRED
              </span>
            </div>

            <div className="space-y-3">
              {recommendations.map(rec => (
                <div
                  key={rec.id}
                  className="p-3 bg-slate-900 border border-slate-800 rounded-md text-xs space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-100">
                      {rec.order}. {rec.action}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase ${
                        rec.urgency === 'HIGH'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {rec.urgency}
                    </span>
                  </div>
                  <div className="text-slate-400">
                    <span className="text-slate-500">Designated Authority:</span> {rec.owner}
                  </div>
                  <div className="text-slate-400 text-[11px] italic">
                    {rec.operationalNote}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs font-mono text-slate-500">
          <div>Investigation ID: {trace?.investigationId || 'INV-2026-NGA-0924'}</div>
          <div>POPU Clinical Decision Support · Version 1.0</div>
        </div>
      </div>
    </div>
  );
};
