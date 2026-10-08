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
  Terminal,
  Activity,
  TrendingUp,
  Database,
  GitBranch,
  Layers,
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
  const progressPercent =
    steps.length > 0 ? Math.round((completedStepsCount / steps.length) * 100) : 0;

  const forecastHorizon = forecast?.forecastHorizonDays || 14;

  return (
    <div className="flex flex-col h-full bg-[var(--popu-muted)] overflow-y-auto">
      {/* Top Banner with Synthetic Data Disclaimer & Navigation Tabs */}
      <div className="border-b border-[var(--popu-border)] bg-[var(--popu-surface)] sticky top-0 z-20">
        {/* Synthetic Warning Header Bar */}
        <div className="px-5 py-2 bg-[var(--popu-warning)]/10 border-b border-[var(--popu-warning)]/20 flex flex-wrap items-center justify-between text-xs font-mono text-[var(--popu-warning)] gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--popu-warning)] animate-pulse" />
            <span className="font-semibold tracking-wider">
              SYNTHETIC DEMONSTRATION DATA
            </span>
            <span className="text-[var(--popu-sub)] hidden sm:inline">
              - Active synthetic investigation scenario
            </span>
          </div>

          <div className="text-[11px] text-[var(--popu-warning)]">
            Algorithmic Decision Support - Not Verified Public Health Records
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="px-5 py-2.5 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'pipeline'
                  ? 'bg-[var(--popu-muted)] text-[var(--popu-teal)] font-semibold shadow-sm'
                  : 'text-[var(--popu-sub)] hover:text-[var(--popu-text)]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Investigation Pipeline</span>
              <span className="text-[10px] font-mono text-[var(--popu-sub)]">
                ({completedStepsCount}/{steps.length})
              </span>
            </button>

            <button
              onClick={() => setActiveTab('anomaly')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'anomaly'
                  ? 'bg-[var(--popu-muted)] text-[var(--popu-teal)] font-semibold shadow-sm'
                  : 'text-[var(--popu-sub)] hover:text-[var(--popu-text)]'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Anomaly Detection</span>
              {anomaly && (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--popu-danger)]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('forecast')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'forecast'
                  ? 'bg-[var(--popu-muted)] text-[var(--popu-teal)] font-semibold shadow-sm'
                  : 'text-[var(--popu-sub)] hover:text-[var(--popu-text)]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{forecastHorizon}-Day Forecast</span>
              {forecast && (
                <span className="text-[10px] font-mono text-[var(--popu-teal)]">
                  ({forecast.riskScore})
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('evidence')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'evidence'
                  ? 'bg-[var(--popu-muted)] text-[var(--popu-teal)] font-semibold shadow-sm'
                  : 'text-[var(--popu-sub)] hover:text-[var(--popu-text)]'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Evidence Matrix</span>
              <span className="text-[10px] font-mono text-[var(--popu-sub)]">
                ({evidence.length})
              </span>
            </button>

            <button
              onClick={() => setActiveTab('tools')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'tools'
                  ? 'bg-[var(--popu-muted)] text-[var(--popu-teal)] font-semibold shadow-sm'
                  : 'text-[var(--popu-sub)] hover:text-[var(--popu-text)]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Agent Tools</span>
              <span className="text-[10px] font-mono text-[var(--popu-sub)]">
                ({toolsExecuted.length})
              </span>
            </button>

            <button
              onClick={() => setActiveTab('trace')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'trace'
                  ? 'bg-[var(--popu-muted)] text-[var(--popu-teal)] font-semibold shadow-sm'
                  : 'text-[var(--popu-sub)] hover:text-[var(--popu-text)]'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Investigation Trace</span>
            </button>
          </div>
        </div>

        {/* Global Pipeline Progress Bar */}
        <div className="w-full bg-[var(--popu-surface)] h-1">
          <div
            className="bg-[var(--popu-teal)] h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Content Stage */}
      <div className="p-5 flex-1 space-y-6">
        {/* Tab 1: Pipeline Stepper & Integrated Dashboard */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            {/* Step execution overview */}
            <div className="bg-[var(--popu-surface)] border border-[var(--popu-border)] rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[var(--popu-border)]">
                <div>
                  <h3 className="text-base font-semibold text-[var(--popu-text)]">
                    Autonomous Investigation Execution
                  </h3>
                  <div className="text-xs text-[var(--popu-sub)] font-mono mt-0.5">
                    Coordinating the investigation across surveillance, hospital,
                    laboratory, and environmental evidence
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  {isInvestigating ? (
                    <span className="text-[var(--popu-teal)] flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Executing Pipeline...
                    </span>
                  ) : (
                    <span className="text-[var(--popu-teal)] flex items-center gap-1.5">
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
                    className={`p-3 rounded-xl border text-xs transition-colors flex items-start gap-2.5 ${
                      step.status === 'completed'
                        ? 'bg-[var(--popu-muted)]/80 border-[var(--popu-border)] text-[var(--popu-text)]'
                        : step.status === 'running'
                        ? 'bg-[var(--popu-muted)] border-[var(--popu-teal)]/50 text-[var(--popu-teal)] shadow-sm'
                        : 'bg-[var(--popu-muted)]/40 border-[var(--popu-border)] text-[var(--popu-sub)]'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {step.status === 'completed' && (
                        <CheckCircle2 className="w-4 h-4 text-[var(--popu-teal)]" />
                      )}

                      {step.status === 'running' && (
                        <Loader2 className="w-4 h-4 text-[var(--popu-teal)] animate-spin" />
                      )}

                      {step.status === 'pending' && (
                        <div className="w-4 h-4 rounded-full border border-[var(--popu-border)] flex items-center justify-center text-[10px] text-[var(--popu-sub)] font-mono">
                          {idx + 1}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="font-medium text-[var(--popu-text)] flex items-center gap-1 truncate">
                        <span>{step.label}</span>
                      </div>

                      <div className="text-[11px] text-[var(--popu-sub)] mt-0.5 line-clamp-1">
                        {step.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inlined Primary Visualizations */}
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
              <div className="p-8 text-center text-[var(--popu-sub)] font-mono text-xs">
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
              <div className="p-8 text-center text-[var(--popu-sub)] font-mono text-xs">
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
              <div className="p-8 text-center text-[var(--popu-sub)] font-mono text-xs">
                Awaiting multi-source evidence extraction...
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Tool Execution Inspector */}
        {activeTab === 'tools' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--popu-border)]">
              <div>
                <h4 className="text-sm font-semibold text-[var(--popu-text)] flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[var(--popu-teal)]" />
                  Autonomous Agent Tool Calls ({toolsExecuted.length})
                </h4>

                <div className="text-xs text-[var(--popu-sub)] font-mono mt-0.5">
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