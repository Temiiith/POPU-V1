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
import {
  X,
  Download,
  Copy,
  Check,
  FileText,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';

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
    a.download = `POPU_Epidemiological_Brief_${disease}_${geography.replace(
      /\s+/g,
      '_',
    )}_2026.md`;

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
- Standardized Deviation: ${
      anomaly?.zScore !== undefined
        ? `${anomaly.zScore >= 0 ? '+' : ''}${anomaly.zScore}`
        : 'N/A'
    } sigma (${
      anomaly?.deviationPercent !== undefined
        ? `${anomaly.deviationPercent >= 0 ? '+' : ''}${anomaly.deviationPercent.toFixed(1)}`
        : 'N/A'
    }%)
- Status: ${anomaly?.status || 'Elevated Signal Detected'}

---

## 3. 14-DAY FORECAST PROJECTION
- Model: ${forecast?.modelName || 'Forecast model unavailable'} (${forecast?.modelVersion || 'N/A'})
- Interval: ${forecast?.predictionInterval || 'N/A'}
- Trend: ${forecast?.trend || 'N/A'}
- Projected Peak: ${forecast?.expectedPeakDate || 'N/A'}

---

## 4. MULTI-MODAL EVIDENCE INVENTORY
${evidence
  .map(
    (e) =>
      `- [${e.category}] ${e.metric}: ${e.value} (${e.label}) | Source: ${e.source} | Baseline: ${e.baselineComparison || 'N/A'}`,
  )
  .join('\n')}

---

## 5. UNCERTAINTY & LIMITATIONS
- Data Completeness: ${uncertainty?.dataCompletenessScore ?? 'N/A'}%
- Missing Information:
${(uncertainty?.missingDataItems || []).map((m) => `  * ${m}`).join('\n')}
- Limitations:
${(uncertainty?.modelLimitations || []).map((l) => `  * ${l}`).join('\n')}

---

## 6. RECOMMENDED PUBLIC HEALTH ACTIONS (HUMAN REVIEW REQUIRED)
${recommendations
  .map(
    (r) =>
      `${r.order}. [${r.urgency}] ${r.action}\n   Owner: ${r.owner}\n   Note: ${r.operationalNote}`,
  )
  .join('\n')}

---
**Audit Trace ID**: ${trace?.investigationId || 'N/A'}
**Disclaimer**: This document is an AI-assisted synthesis of synthetic surveillance signals. All interventions require formal authorization by the State Epidemiologist.
`;
  };

  const forecastHorizon = forecast?.forecastHorizonDays || 14;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-[var(--popu-surface)] border border-[var(--popu-border)] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-[var(--popu-border)] flex items-center justify-between bg-[var(--popu-muted)]">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-[var(--popu-teal)]" />

            <div>
              <h3 className="text-base font-semibold text-[var(--popu-text)]">
                Epidemiological Investigation Brief
              </h3>

              <div className="text-xs text-[var(--popu-sub)] font-mono">
                {disease} - {geography} - Status:{' '}
                {riskAssessment?.investigationStatus || 'Requires investigation'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-medium text-[var(--popu-sub)] bg-[var(--popu-muted)] hover:bg-[var(--popu-surface)] rounded-lg border border-[var(--popu-border)] flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[var(--popu-teal)]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}

              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 text-xs font-medium text-white bg-[var(--popu-teal)] hover:bg-[var(--popu-teal-dark)] rounded-lg flex items-center gap-1.5 font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[var(--popu-sub)] hover:text-[var(--popu-text)] rounded-lg hover:bg-[var(--popu-muted)] transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[var(--popu-text)]">
          {/* Synthetic Demo Warning */}
          <div className="p-3.5 bg-[var(--popu-warning)]/10 border border-[var(--popu-warning)]/30 rounded-xl flex items-start gap-3 text-xs text-[var(--popu-warning)]">
            <AlertTriangle className="w-4 h-4 text-[var(--popu-warning)] shrink-0 mt-0.5" />

            <div>
              <span className="font-semibold uppercase tracking-wider font-mono">
                SYNTHETIC DEMONSTRATION DATA:
              </span>{' '}
              The epidemiological metrics, laboratory positives, and hospital
              figures in this brief are algorithmically generated for
              demonstration and evaluation purposes. They do not constitute
              official verified statistics for any Nigerian jurisdiction.
            </div>
          </div>

          {/* Section 1: Executive Signal Summary */}
          <div className="border border-[var(--popu-border)] rounded-xl p-4 bg-[var(--popu-muted)]/60">
            <h4 className="text-xs uppercase font-mono tracking-wider text-[var(--popu-teal)] font-semibold mb-2">
              1. Signal Summary & Risk Assessment
            </h4>

            <p className="text-[var(--popu-sub)] leading-relaxed text-sm">
              {riskAssessment?.rationale || 'No risk rationale available.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-[var(--popu-border)] font-mono text-xs">
              <div>
                <span className="text-[var(--popu-sub)] block">
                  Signal Level
                </span>
                <span className="text-[var(--popu-danger)] font-semibold">
                  {riskAssessment?.signalStatus || 'N/A'}
                </span>
              </div>

              <div>
                <span className="text-[var(--popu-sub)] block">
                  Forecast Horizon
                </span>
                <span className="text-[var(--popu-text)] font-semibold">
                  {forecastHorizon} Days
                </span>
              </div>

              <div>
                <span className="text-[var(--popu-sub)] block">
                  Forecast Score
                </span>
                <span className="text-[var(--popu-warning)] font-semibold">
                  {forecast?.riskScore ?? 'N/A'}/100
                </span>
              </div>

              <div>
                <span className="text-[var(--popu-sub)] block">
                  Human Review
                </span>
                <span className="text-[var(--popu-teal)] font-semibold">
                  MANDATORY
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Anomaly & Forecast Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-[var(--popu-border)] rounded-xl p-4 bg-[var(--popu-muted)]/60">
              <h4 className="text-xs uppercase font-mono tracking-wider text-[var(--popu-teal)] font-semibold mb-2">
                2. Anomaly Analysis
              </h4>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-[var(--popu-border)]">
                  <span className="text-[var(--popu-sub)]">Method</span>
                  <span className="text-[var(--popu-text)]">
                    {anomaly?.method || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-[var(--popu-border)]">
                  <span className="text-[var(--popu-sub)]">
                    Observed Value
                  </span>
                  <span className="text-[var(--popu-danger)] font-semibold">
                    {anomaly?.observedValue ?? 'N/A'} cases/wk
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-[var(--popu-border)]">
                  <span className="text-[var(--popu-sub)]">
                    Expected Baseline
                  </span>
                  <span className="text-[var(--popu-sub)]">
                    {anomaly?.expectedBaseline ?? 'N/A'} cases/wk
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-[var(--popu-sub)]">
                    Standardized Z-Score
                  </span>

                  <span className="text-[var(--popu-warning)] font-semibold">
                    {anomaly?.zScore !== undefined
                      ? `${anomaly.zScore >= 0 ? '+' : ''}${anomaly.zScore}`
                      : 'N/A'}{' '}
                    sigma
                    {anomaly?.deviationPercent !== undefined
                      ? ` (${anomaly.deviationPercent >= 0 ? '+' : ''}${anomaly.deviationPercent.toFixed(1)}%)`
                      : ''}
                  </span>
                </div>
              </div>
            </div>

            <div className="border border-[var(--popu-border)] rounded-xl p-4 bg-[var(--popu-muted)]/60">
              <h4 className="text-xs uppercase font-mono tracking-wider text-[var(--popu-teal)] font-semibold mb-2">
                3. Deterministic Trend Forecasting ({forecastHorizon}-Day Horizon)
              </h4>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-[var(--popu-border)]">
                  <span className="text-[var(--popu-sub)]">
                    Model Name
                  </span>
                  <span className="text-[var(--popu-text)]">
                    {forecast?.modelName || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-[var(--popu-border)]">
                  <span className="text-[var(--popu-sub)]">
                    Prediction Interval
                  </span>
                  <span className="text-[var(--popu-teal)]">
                    {forecast?.predictionInterval || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-[var(--popu-border)]">
                  <span className="text-[var(--popu-sub)]">
                    Trajectory Velocity
                  </span>

                  <span className="text-[var(--popu-danger)] capitalize">
                    {forecast?.trend
                      ? forecast.trend.replace('_', ' ')
                      : 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-[var(--popu-sub)]">
                    Expected Peak Date
                  </span>

                  <span className="text-[var(--popu-text)]">
                    {forecast?.expectedPeakDate || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Evidence Matrix Table */}
          <div className="border border-[var(--popu-border)] rounded-xl p-4 bg-[var(--popu-muted)]/60">
            <h4 className="text-xs uppercase font-mono tracking-wider text-[var(--popu-teal)] font-semibold mb-3">
              4. Multi-Modal Evidence Inventory
            </h4>

            <div className="space-y-2.5">
              {evidence.length > 0 ? (
                evidence.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-[var(--popu-surface)] border border-[var(--popu-border)] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="text-[var(--popu-teal)] font-semibold">
                          {item.category}
                        </span>

                        <span className="text-[var(--popu-sub)]">
                          -
                        </span>

                        <span className="text-[var(--popu-sub)]">
                          {item.geography}
                        </span>
                      </div>

                      <div className="font-medium text-[var(--popu-text)] mt-0.5">
                        {item.metric}
                      </div>
                    </div>

                    <div className="sm:text-right font-mono">
                      <div className="text-[var(--popu-teal)] font-semibold">
                        {item.value}
                      </div>

                      <div className="text-[10px] text-[var(--popu-sub)]">
                        {item.baselineComparison || 'N/A'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-[var(--popu-sub)]">
                  No evidence items are available for this investigation.
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Uncertainty & Limitations */}
          <div className="border border-[var(--popu-border)] rounded-xl p-4 bg-[var(--popu-muted)]/60">
            <h4 className="text-xs uppercase font-mono tracking-wider text-[var(--popu-warning)] font-semibold mb-2">
              5. Uncertainty & Data Limitations
            </h4>

            <p className="text-xs text-[var(--popu-sub)] mb-3 leading-relaxed">
              {uncertainty?.predictionIntervalDescription ||
                'No uncertainty description available.'}
            </p>

            <div className="space-y-1.5 text-xs text-[var(--popu-sub)]">
              {(uncertainty?.missingDataItems || []).length > 0 ? (
                uncertainty?.missingDataItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-[var(--popu-warning)]">
                      -
                    </span>
                    <span>{item}</span>
                  </div>
                ))
              ) : (
                <div>No missing data items reported.</div>
              )}
            </div>
          </div>

          {/* Section 5: Recommended Investigation Actions */}
          <div className="border border-[var(--popu-border)] rounded-xl p-4 bg-[var(--popu-muted)]/60">
            <div className="flex items-center justify-between mb-3 gap-3">
              <h4 className="text-xs uppercase font-mono tracking-wider text-[var(--popu-teal)] font-semibold">
                6. Recommended Investigation Actions
              </h4>

              <span className="text-[11px] font-mono text-[var(--popu-warning)] font-semibold bg-[var(--popu-warning)]/10 px-2 py-0.5 rounded border border-[var(--popu-warning)]/20 flex items-center gap-1 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
                HUMAN REVIEW REQUIRED
              </span>
            </div>

            <div className="space-y-3">
              {recommendations.length > 0 ? (
                recommendations.map((recommendation) => (
                  <div
                    key={recommendation.id}
                    className="p-3 bg-[var(--popu-surface)] border border-[var(--popu-border)] rounded-lg text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-[var(--popu-text)]">
                        {recommendation.order}. {recommendation.action}
                      </span>

                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase ${
                          recommendation.urgency === 'HIGH'
                            ? 'bg-[var(--popu-danger)]/20 text-[var(--popu-danger)]'
                            : 'bg-[var(--popu-warning)]/20 text-[var(--popu-warning)]'
                        }`}
                      >
                        {recommendation.urgency}
                      </span>
                    </div>

                    <div className="text-[var(--popu-sub)]">
                      <span className="text-[var(--popu-sub)]">
                        Designated Authority:
                      </span>{' '}
                      {recommendation.owner}
                    </div>

                    <div className="text-[var(--popu-sub)] text-[11px] italic">
                      {recommendation.operationalNote}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-[var(--popu-sub)]">
                  No recommended actions are available.
                </div>
              )}
            </div>
          </div>

          {/* AI Interpretation */}
          {aiInterpretation && (
            <div className="border border-[var(--popu-border)] rounded-xl p-4 bg-[var(--popu-muted)]/60">
              <h4 className="text-xs uppercase font-mono tracking-wider text-[var(--popu-teal)] font-semibold mb-2">
                7. AI Interpretation
              </h4>

              <p className="text-xs text-[var(--popu-sub)] leading-relaxed">
                {aiInterpretation.interpretation}
              </p>

              <div className="mt-3 pt-3 border-t border-[var(--popu-border)] text-[10px] font-mono text-[var(--popu-sub)]">
                {aiInterpretation.disclaimer}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[var(--popu-border)] bg-[var(--popu-muted)] flex items-center justify-between text-xs font-mono text-[var(--popu-sub)]">
          <div>
            Investigation ID: {trace?.investigationId || 'INV-2026-NGA-0924'}
          </div>

          <div>
            POPU Clinical Decision Support - Version 1.0
          </div>
        </div>
      </div>
    </div>
  );
};