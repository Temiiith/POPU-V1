import React, { useState } from 'react';
import {
  InvestigationStep,
  ToolExecution,
  AnomalyResult,
  ForecastResult,
  EvidenceItem,
  InvestigationTrace,
} from '../../types/agent';
import { AnomalyChart } from './AnomalyChart';
import { ForecastChart } from './ForecastChart';
import { EvidencePanel } from './EvidencePanel';
import { ToolExecutionCard } from './ToolExecutionCard';
import { InvestigationTraceView } from './InvestigationTraceView';
import {
  CheckCircle2,
  Loader2,
  Clock,
  Terminal,
  Activity,
  TrendingUp,
  Database,
  GitBranch,
  Layers,
  AlertTriangle,
} from 'lucide-react';

interface InvestigationExecutionPanelProps {
  steps: InvestigationStep[];
  toolsExecuted: ToolExecution[];
  anomaly: AnomalyResult | null;
  forecast: ForecastResult | null;
  evidence: EvidenceItem[];
  trace: InvestigationTrace | null;
  isInvestigating: boolean;
  onAnomalyMethodChange?: (updated: AnomalyResult) => void;
}

export const InvestigationExecutionPanel: React.FC<InvestigationExecutionPanelProps> = ({
  steps,
  toolsExecuted,
  anomaly,
  forecast,
  evidence,
  trace,
  isInvestigating,
  onAnomalyMethodChange,
}) => {
  const [activeTab, setActiveTab] = useState<
    'pipeline' | 'anomaly' | 'forecast' | 'evidence' | 'tools' | 'trace'
  >('pipeline');

  const completedStepsCount = steps.filter((s) => s.status === 'completed').length;
  const progressPercent = Math.round((completedStepsCount / steps.length) * 100);

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto">
      {/* Top Banner with Synthetic Data Disclaimer & Navigation Tabs */}
      <div className="border-b border-slate-800 bg-slate-900 sticky top-0 z-20">
        {/* Synthetic Warning Header Bar */}
        <div className="px-5 py-2 bg-amber-500/10 border-b border-amber-500/20 flex flex-wrap items-center justify-between text-xs font-mono text-amber-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="font-semibold tracking-wider">SYNTHETIC DEMONSTRATION DATA</span>
            <span className="text-slate-400 hidden sm:inline">· Active synthetic investigation scenario</span>
          </div>
          <div className="text-[11px] text-amber-500/90">
            Algorithmic Decision Support · Not Verified Public Health Records
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="px-5 py-2.5 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'pipeline'
                  ? 'bg-slate-800 text-teal-300 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Investigation Pipeline</span>
              <span className="text-[10px] font-mono text-slate-500">
                ({completedStepsCount}/{steps.length})
              </span>
            </button>

            <button
              onClick={() => setActiveTab('anomaly')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'anomaly'
                  ? 'bg-slate-800 text-teal-300 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Anomaly Detection</span>
              {anomaly && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('forecast')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'forecast'
                  ? 'bg-slate-800 text-teal-300 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>14-Day Forecast</span>
              {forecast && (
                <span className="text-[10px] font-mono text-teal-400">({forecast.riskScore})</span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('evidence')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'evidence'
                  ? 'bg-slate-800 text-teal-300 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Evidence Matrix</span>
              <span className="text-[10px] font-mono text-slate-500">({evidence.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('tools')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'tools'
                  ? 'bg-slate-800 text-teal-300 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Agent Tools</span>
              <span className="text-[10px] font-mono text-slate-500">({toolsExecuted.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('trace')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'trace'
                  ? 'bg-slate-800 text-teal-300 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Investigation Trace</span>
            </button>
          </div>
        </div>

        {/* Global Pipeline Progress Bar */}
        <div className="w-full bg-slate-900 h-1">
          <div
            className="bg-teal-400 h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Main Content Stage */}
      <div className="p-5 flex-1 space-y-6">
        {/* Tab 1: Pipeline Stepper & Integrated Dashboard */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            {/* Step execution overview */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-semibold text-slate-100">
                    Autonomous Investigation Execution
                  </h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Coordinating 12 verification checkpoints across surveillance, hospital, lab, &amp; environmental feeds
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  {isInvestigating ? (
                    <span className="text-teal-400 flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Executing Pipeline...
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Investigation Complete
                    </span>
                  )}
                </div>
              </div>

              {/* Observable Stepper Grid */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {steps.map((step, idx) => (
                  <div
                    key={step.id}
                    className={`p-3 rounded-md border text-xs transition-colors flex items-start gap-2.5 ${
                      step.status === 'completed'
                        ? 'bg-slate-950/80 border-slate-800 text-slate-200'
                        : step.status === 'running'
                        ? 'bg-teal-950/30 border-teal-500/50 text-teal-200 shadow-sm'
                        : 'bg-slate-950/40 border-slate-850 text-slate-500'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {step.status === 'completed' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                      {step.status === 'running' && (
                        <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />
                      )}
                      {step.status === 'pending' && (
                        <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-500 font-mono">
                          {idx + 1}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="font-medium text-slate-100 flex items-center gap-1 truncate">
                        <span>{step.label}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {step.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inlined Primary Visualizations: Anomaly and Forecast */}
            {anomaly && (
              <AnomalyChart
                anomaly={anomaly}
                onMethodChange={onAnomalyMethodChange}
              />
            )}

            {forecast && <ForecastChart forecast={forecast} />}

            {/* Quick Evidence Matrix Preview */}
            {evidence.length > 0 && <EvidencePanel evidence={evidence} />}

            {/* Expandable Trace View */}
            {trace && <InvestigationTraceView trace={trace} />}
          </div>
        )}

        {/* Tab 2: Anomaly Detection Detail */}
        {activeTab === 'anomaly' && (
          <div className="space-y-4">
            {anomaly ? (
              <AnomalyChart
                anomaly={anomaly}
                onMethodChange={onAnomalyMethodChange}
              />
            ) : (
              <div className="p-8 text-center text-slate-500 font-mono text-xs">
                Awaiting anomaly algorithm execution...
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Forecast Detail */}
        {activeTab === 'forecast' && (
          <div className="space-y-4">
            {forecast ? (
              <ForecastChart forecast={forecast} />
            ) : (
              <div className="p-8 text-center text-slate-500 font-mono text-xs">
                Awaiting forecast model projection...
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Evidence Detail */}
        {activeTab === 'evidence' && (
          <div className="space-y-4">
            {evidence.length > 0 ? (
              <EvidencePanel evidence={evidence} />
            ) : (
              <div className="p-8 text-center text-slate-500 font-mono text-xs">
                Awaiting multi-source evidence extraction...
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Tool Execution Inspector */}
        {activeTab === 'tools' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-teal-400" />
                  Autonomous Agent Tool Calls ({toolsExecuted.length})
                </h4>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Inspect raw inputs, outputs, data provenance, and latency budgets
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {toolsExecuted.map((tool) => (
                <ToolExecutionCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Trace View */}
        {activeTab === 'trace' && trace && (
          <InvestigationTraceView trace={trace} />
        )}
      </div>
    </div>
  );
};
