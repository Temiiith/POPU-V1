import React from 'react';
import {
  RiskAssessment,
  UncertaintyAnalysis,
  AIInterpretation,
  RecommendationAction,
  ForecastResult,
  DiseaseType,
} from '../../types/agent';
import {
  ShieldAlert,
  HelpCircle,
  Brain,
  ListChecks,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface IntelligenceSummaryPanelProps {
  disease: DiseaseType;
  geography: string;
  riskAssessment: RiskAssessment | null;
  uncertainty: UncertaintyAnalysis | null;
  aiInterpretation: AIInterpretation | null;
  recommendations: RecommendationAction[];
  forecast: ForecastResult | null;
  onOpenBrief: () => void;
}

export const IntelligenceSummaryPanel: React.FC<IntelligenceSummaryPanelProps> = ({
  disease,
  geography,
  riskAssessment,
  uncertainty,
  aiInterpretation,
  recommendations,
  forecast,
  onOpenBrief,
}) => {
  return (
    <div className="flex flex-col h-full bg-[var(--popu-surface)] border-l border-[var(--popu-border)] overflow-y-auto">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[var(--popu-border)] bg-[var(--popu-muted)] flex items-center justify-between shrink-0">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--popu-text)]">
            Intelligence Summary
          </span>

          <div className="text-[11px] text-[var(--popu-sub)] font-mono mt-0.5">
            Epidemiological Decision Support
          </div>
        </div>

        <button
          onClick={onOpenBrief}
          className="px-2.5 py-1 text-xs font-medium text-[var(--popu-teal)] hover:text-[var(--popu-teal)] bg-[var(--popu-muted)] hover:bg-[var(--popu-surface)] border border-[var(--popu-teal)]/30 rounded-lg flex items-center gap-1.5 transition-colors"
        >
          <span>Full Brief</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Top Status Dashboard Matrix */}
        <div className="bg-[var(--popu-muted)] border border-[var(--popu-border)] rounded-xl p-3 text-xs font-mono space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-[var(--popu-border)]">
            <span className="text-[var(--popu-sub)]">Target Disease:</span>
            <span className="text-[var(--popu-text)] font-semibold">
              {disease}
            </span>
          </div>

          <div className="flex items-center justify-between pb-1.5 border-b border-[var(--popu-border)]">
            <span className="text-[var(--popu-sub)]">Geography:</span>
            <span className="text-[var(--popu-text)] font-semibold">
              {geography}
            </span>
          </div>

          <div className="flex items-center justify-between pb-1.5 border-b border-[var(--popu-border)]">
            <span className="text-[var(--popu-sub)]">
              Investigation Status:
            </span>

            <span className="text-[var(--popu-danger)] font-semibold">
              {riskAssessment?.investigationStatus || 'Requires investigation'}
            </span>
          </div>

          <div className="flex items-center justify-between pb-1.5 border-b border-[var(--popu-border)]">
            <span className="text-[var(--popu-sub)]">Signal Status:</span>

            <span className="text-[var(--popu-warning)] font-semibold">
              {riskAssessment?.signalStatus || 'Elevated signal'}
            </span>
          </div>

          <div className="flex items-center justify-between pb-1.5 border-b border-[var(--popu-border)]">
            <span className="text-[var(--popu-sub)]">
              Forecast Horizon:
            </span>

            <span className="text-[var(--popu-teal)]">
              {forecast?.forecastHorizonDays || 14} days
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[var(--popu-sub)]">Human Review:</span>

            <span className="text-[var(--popu-teal)] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              MANDATORY
            </span>
          </div>
        </div>

        {/* Risk Assessment Card */}
        {riskAssessment && (
          <div className="bg-[var(--popu-muted)]/90 border border-[var(--popu-danger)]/30 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--popu-danger)]/5 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center gap-2 text-[var(--popu-danger)] font-mono text-xs font-semibold uppercase tracking-wider mb-1.5">
              <ShieldAlert className="w-4 h-4 text-[var(--popu-danger)]" />
              <span>{riskAssessment.signalTitle}</span>
            </div>

            <div className="text-xs text-[var(--popu-sub)] leading-relaxed">
              {riskAssessment.rationale}
            </div>

            <div className="mt-3 pt-2.5 border-t border-[var(--popu-border)] text-[11px] font-mono text-[var(--popu-sub)] flex items-center justify-between">
              <span>
                Status:{' '}
                <strong className="text-[var(--popu-danger)] font-normal">
                  {riskAssessment.investigationStatus}
                </strong>
              </span>

              <span>
                Horizon: {forecast?.forecastHorizonDays || 14} Days
              </span>
            </div>
          </div>
        )}

        {/* AI Interpretation */}
        {aiInterpretation && (
          <div className="bg-[var(--popu-muted)] border border-[var(--popu-border)] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--popu-border)]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--popu-text)]">
                <Brain className="w-4 h-4 text-[var(--popu-teal)]" />
                <span>AI Interpretation of Evidence</span>
              </div>

              <span className="text-[10px] font-mono text-[var(--popu-sub)] bg-[var(--popu-surface)] px-1.5 py-0.5 rounded border border-[var(--popu-border)]">
                AI INTERPRETATION
              </span>
            </div>

            <div>
              <div className="text-xs uppercase font-mono text-[var(--popu-sub)] mb-1">
                What the system found
              </div>

              <p className="text-xs text-[var(--popu-sub)] leading-relaxed">
                {aiInterpretation.whatSystemFound}
              </p>
            </div>

            <div>
              <div className="text-xs uppercase font-mono text-[var(--popu-sub)] mb-1.5">
                Supporting Signals
              </div>

              <div className="space-y-1.5">
                {aiInterpretation.supportingSignals.map((sig, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-[var(--popu-surface)] border border-[var(--popu-border)] rounded-lg text-xs"
                  >
                    <div className="font-medium text-[var(--popu-teal)]">
                      {sig.category}: {sig.signal}
                    </div>

                    <div className="text-[11px] text-[var(--popu-sub)] mt-0.5">
                      {sig.details}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--popu-border)]">
              <div className="text-xs uppercase font-mono text-[var(--popu-sub)] mb-1">
                Interpretation
              </div>

              <p className="text-xs text-[var(--popu-sub)] leading-relaxed italic">
                "{aiInterpretation.interpretation}"
              </p>

              <div className="text-[10px] text-[var(--popu-sub)] mt-2 font-mono">
                {aiInterpretation.disclaimer}
              </div>
            </div>
          </div>
        )}

        {/* Uncertainty & Limitations */}
        {uncertainty && (
          <div className="bg-[var(--popu-muted)] border border-[var(--popu-border)] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--popu-border)]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--popu-text)]">
                <HelpCircle className="w-4 h-4 text-[var(--popu-warning)]" />
                <span>Uncertainty &amp; Limitations</span>
              </div>

              <span className="text-[10px] font-mono text-[var(--popu-warning)] bg-[var(--popu-warning)]/10 px-1.5 py-0.5 rounded border border-[var(--popu-warning)]/20">
                UNCERTAINTY
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-[var(--popu-sub)]">
                  Data Completeness Score:
                </span>

                <span className="text-[var(--popu-warning)] font-semibold">
                  {uncertainty.dataCompletenessScore}%
                </span>
              </div>

              <div className="w-full bg-[var(--popu-surface)] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[var(--popu-warning)] h-full rounded-full"
                  style={{
                    width: `${uncertainty.dataCompletenessScore}%`,
                  }}
                />
              </div>
            </div>

            <div className="text-xs text-[var(--popu-sub)] leading-relaxed bg-[var(--popu-surface)] p-2.5 rounded-lg border border-[var(--popu-border)]">
              {uncertainty.predictionIntervalDescription}
            </div>

            <div>
              <div className="text-xs uppercase font-mono text-[var(--popu-sub)] mb-1">
                Missing Data Items
              </div>

              <ul className="text-xs text-[var(--popu-sub)] space-y-1">
                {uncertainty.missingDataItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-1.5"
                  >
                    <span className="text-[var(--popu-warning)] mt-0.5">
                      -
                    </span>

                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-[var(--popu-border)] text-[11px] font-mono text-[var(--popu-sub)]">
              Assumptions: {uncertainty.assumptions.join(' - ')}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-[var(--popu-muted)] border border-[var(--popu-border)] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--popu-border)]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--popu-text)]">
                <ListChecks className="w-4 h-4 text-[var(--popu-teal)]" />
                <span>Recommended Actions</span>
              </div>

              <span className="text-[10px] font-mono text-[var(--popu-danger)] bg-[var(--popu-danger)]/10 px-1.5 py-0.5 rounded border border-[var(--popu-danger)]/20">
                RECOMMENDATION
              </span>
            </div>

            <div className="space-y-2.5">
              {recommendations.map((recommendation) => (
                <div
                  key={recommendation.id}
                  className="p-2.5 bg-[var(--popu-surface)] border border-[var(--popu-border)] rounded-lg text-xs space-y-1"
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="font-semibold text-[var(--popu-text)]">
                      {recommendation.order}. {recommendation.action}
                    </span>

                    <span
                      className={`text-[9px] font-mono px-1 py-0.5 rounded uppercase shrink-0 ${
                        recommendation.urgency === 'HIGH'
                          ? 'bg-[var(--popu-danger)]/20 text-[var(--popu-danger)]'
                          : 'bg-[var(--popu-warning)]/20 text-[var(--popu-warning)]'
                      }`}
                    >
                      {recommendation.urgency}
                    </span>
                  </div>

                  <div className="text-[11px] text-[var(--popu-sub)]">
                    {recommendation.operationalNote}
                  </div>

                  <div className="text-[10px] text-[var(--popu-sub)] font-mono">
                    Owner: {recommendation.owner}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 p-2.5 bg-[var(--popu-warning)]/10 border border-[var(--popu-warning)]/30 rounded-lg text-[var(--popu-warning)] text-xs flex items-center gap-2 font-mono">
              <ShieldCheck className="w-4 h-4 text-[var(--popu-warning)] shrink-0" />

              <span>
                HUMAN REVIEW REQUIRED: Public health decisions require officer sign-off.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};