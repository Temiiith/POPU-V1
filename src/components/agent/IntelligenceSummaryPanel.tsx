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
  AlertOctagon,
  FileCheck,
  HelpCircle,
  Brain,
  ListChecks,
  ExternalLink,
  ShieldCheck,
  Activity,
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
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 overflow-y-auto">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Intelligence Summary
          </span>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
            Epidemiological Decision Support
          </div>
        </div>

        <button
          onClick={onOpenBrief}
          className="px-2.5 py-1 text-xs font-medium text-teal-300 hover:text-teal-200 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 rounded flex items-center gap-1.5 transition-colors"
        >
          <span>Full Brief</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Top Status Dashboard Matrix */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-850">
            <span className="text-slate-400">Target Disease:</span>
            <span className="text-slate-100 font-semibold">{disease}</span>
          </div>
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-850">
            <span className="text-slate-400">Geography:</span>
            <span className="text-slate-100 font-semibold">{geography}</span>
          </div>
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-850">
            <span className="text-slate-400">Investigation Status:</span>
            <span className="text-rose-400 font-semibold">
              {riskAssessment?.investigationStatus || 'Requires investigation'}
            </span>
          </div>
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-850">
            <span className="text-slate-400">Signal Status:</span>
            <span className="text-amber-400 font-semibold">
              {riskAssessment?.signalStatus || 'Elevated signal'}
            </span>
          </div>
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-850">
            <span className="text-slate-400">Forecast Horizon:</span>
            <span className="text-teal-300">{forecast?.forecastHorizonDays || 14} days</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Human Review:</span>
            <span className="text-teal-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              MANDATORY
            </span>
          </div>
        </div>

        {/* Risk Assessment Card */}
        {riskAssessment && (
          <div className="bg-slate-950/90 border border-rose-500/30 rounded-lg p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>{riskAssessment.signalTitle}</span>
            </div>
            <div className="text-xs text-slate-300 leading-relaxed">
              {riskAssessment.rationale}
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Status: <strong className="text-rose-400 font-normal">{riskAssessment.investigationStatus}</strong></span>
              <span>Horizon: 14 Days</span>
            </div>
          </div>
        )}

        {/* AI Interpretation */}
        {aiInterpretation && (
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Brain className="w-4 h-4 text-teal-400" />
                <span>AI Interpretation of Evidence</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                AI INTERPRETATION
              </span>
            </div>

            <div>
              <div className="text-xs uppercase font-mono text-slate-400 mb-1">What the system found</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {aiInterpretation.whatSystemFound}
              </p>
            </div>

            <div>
              <div className="text-xs uppercase font-mono text-slate-400 mb-1.5">Supporting Signals</div>
              <div className="space-y-1.5">
                {aiInterpretation.supportingSignals.map((sig, idx) => (
                  <div key={idx} className="p-2 bg-slate-900 border border-slate-850 rounded text-xs">
                    <div className="font-medium text-teal-300">{sig.category}: {sig.signal}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{sig.details}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-xs uppercase font-mono text-slate-400 mb-1">Interpretation</div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{aiInterpretation.interpretation}"
              </p>
              <div className="text-[10px] text-slate-500 mt-2 font-mono">
                {aiInterpretation.disclaimer}
              </div>
            </div>
          </div>
        )}

        {/* Uncertainty & Limitations */}
        {uncertainty && (
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Uncertainty &amp; Limitations</span>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                UNCERTAINTY
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">Data Completeness Score:</span>
                <span className="text-amber-400 font-semibold">{uncertainty.dataCompletenessScore}%</span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full"
                  style={{ width: `${uncertainty.dataCompletenessScore}%` }}
                ></div>
              </div>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-2.5 rounded border border-slate-800">
              {uncertainty.predictionIntervalDescription}
            </div>

            <div>
              <div className="text-xs uppercase font-mono text-slate-400 mb-1">Missing Data Items</div>
              <ul className="text-xs text-slate-400 space-y-1">
                {uncertainty.missingDataItems.map((m, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400 mt-0.5">·</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-500">
              Assumptions: {uncertainty.assumptions.join(' · ')}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <ListChecks className="w-4 h-4 text-teal-400" />
                <span>Recommended Actions</span>
              </div>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                RECOMMENDATION
              </span>
            </div>

            <div className="space-y-2.5">
              {recommendations.map((r) => (
                <div
                  key={r.id}
                  className="p-2.5 bg-slate-900 border border-slate-850 rounded text-xs space-y-1"
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="font-semibold text-slate-100">
                      {r.order}. {r.action}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1 py-0.5 rounded uppercase shrink-0 ${
                        r.urgency === 'HIGH'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {r.urgency}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">{r.operationalNote}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Owner: {r.owner}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded text-amber-300 text-xs flex items-center gap-2 font-mono">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>HUMAN REVIEW REQUIRED: Public health decisions require officer sign-off.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
