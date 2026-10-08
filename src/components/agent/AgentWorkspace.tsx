import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  FlaskConical,
  Hospital,
  MapPinned,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Waves,
} from 'lucide-react';

import {
  AgentExecutionState,
  INITIAL_INVESTIGATION_STEPS,
} from '../../services/agentService';

import {
  investigateWithBackend,
  interpretWithBackend,
  mapBackendResultToAgentState,
} from '../../services/popuApi';

import {
  ChatMessage,
  EvidenceItem,
} from '../../types/agent';

import { ForecastChart } from './ForecastChart';
import { InvestigationTraceView } from './InvestigationTraceView';

interface Props {
  initialPrompt?: string;
  onOpenBriefGlobal?: () => void;
  onInvestigationComplete?: (
    trace: import('../../types/agent').InvestigationTrace,
  ) => void;
}

const INVESTIGATION_PHASES = [
  {
    id: 'phase-1',
    label: 'Understanding request',
    description: 'Parse the investigation target and define scope',
    stepIndexes: [0, 1],
  },
  {
    id: 'phase-2',
    label: 'Analyzing surveillance signal',
    description: 'Assess current cases against the historical baseline',
    stepIndexes: [2, 3],
  },
  {
    id: 'phase-3',
    label: 'Checking supporting evidence',
    description:
      'Cross-check LGA, hospital, laboratory, and environmental signals',
    stepIndexes: [4, 5, 6, 7],
  },
  {
    id: 'phase-4',
    label: 'Modeling risk',
    description:
      'Run anomaly detection and deterministic forecast models',
    stepIndexes: [8, 9],
  },
  {
    id: 'phase-5',
    label: 'Interpreting & recommending',
    description:
      'Synthesize evidence, guidance, uncertainty, and review brief',
    stepIndexes: [10, 11],
  },
];

const emptyState = (): AgentExecutionState => ({
  isInvestigating: false,
  activeStepId: null,
  steps: INITIAL_INVESTIGATION_STEPS.map(s => ({
    ...s,
    status: 'pending',
  })),
  toolsExecuted: [],
  evidence: [],
  anomaly: null,
  forecast: null,
  riskAssessment: null,
  uncertainty: null,
  aiInterpretation: null,
  recommendations: [],
  trace: null,
  activeDisease: 'Cholera',
  activeGeography: 'Nigeria',
  dataAvailabilityStatus: 'not_checked',
  dataAvailabilityMessage: null,
});

const statusIcon = (status: string) =>
  status === 'completed' ? (
    <CheckCircle2
      size={15}
      className="text-[var(--popu-teal)]"
    />
  ) : status === 'running' ? (
    <RefreshCw
      size={15}
      className="text-[var(--popu-warning)] animate-spin"
    />
  ) : (
    <Clock3
      size={15}
      className="text-[var(--popu-sub)]"
    />
  );

const evidenceIcon = (category: string) =>
  category === 'LABORATORY' ? (
    <FlaskConical size={15} />
  ) : category === 'HOSPITAL' ? (
    <Hospital size={15} />
  ) : category === 'ENVIRONMENT' ? (
    <Waves size={15} />
  ) : category === 'GEOGRAPHIC' ? (
    <MapPinned size={15} />
  ) : (
    <Activity size={15} />
  );

export const AgentWorkspace: React.FC<Props> = ({
  initialPrompt,
  onInvestigationComplete,
}) => {
  const [state, setState] = useState<AgentExecutionState>(
    emptyState(),
  );

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState(initialPrompt || '');
  const [started, setStarted] = useState(false);
  const autoRunRef = useRef(false);

  const [selectedDisease, setSelectedDisease] =
    useState('cholera');

  const [selectedGeography, setSelectedGeography] =
    useState('Edo State');

  const [forecastHorizon, setForecastHorizon] =
    useState(14);

  useEffect(() => {
    if (!initialPrompt) return;

    const prompt = initialPrompt.toLowerCase();

    if (prompt.includes('dengue')) {
      setSelectedDisease('dengue');
    } else if (prompt.includes('lassa')) {
      setSelectedDisease('lassa fever');
    } else if (prompt.includes('cholera')) {
      setSelectedDisease('cholera');
    }

    if (prompt.includes('lagos')) {
      setSelectedGeography('Lagos State');
    } else if (prompt.includes('oyo')) {
      setSelectedGeography('Oyo State');
    } else if (prompt.includes('edo')) {
      setSelectedGeography('Edo State');
    }
  }, [initialPrompt]);

  const run = async (text: string) => {
    if (!text.trim() || state.isInvestigating) {
      return;
    }

    setState(prev => ({
      ...prev,
      isInvestigating: true,
      activeStepId: 'parse-request',
    }));

    setStarted(true);
    setQuery(text);

    setMessages(m => [
      ...m,
      {
        id: `u-${Date.now()}`,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        text,
      },
    ]);

    try {
      const backendResult = await investigateWithBackend(
        text,
        forecastHorizon,
      );

      const result = mapBackendResultToAgentState(
        backendResult,
        text,
      );

      let enrichedResult = result;

      try {
        const cleanLLMText = (value: string) =>
          value
            .replace(/\*\*([\s\S]*?)\*\*/g, '$1')
            .replace(/__([\s\S]*?)__/g, '$1')
            .replace(/`([^`]+)`/g, '$1')
            .replace(/^#{1,6}\s*/gm, '')
            .replace(/^[-*]\s+/gm, '- ')
            .replace(/^---$/gm, '')
            .replace(/&#x20;/g, ' ')
            .trim();

        const llmResult = await interpretWithBackend(
          text,
          forecastHorizon,
        );

        enrichedResult = {
          ...result,
          aiInterpretation: {
            ...result.aiInterpretation!,
            interpretation: cleanLLMText(
              llmResult.interpretation,
            ),
            disclaimer: llmResult.human_review_required
              ? 'AI interpretation only. Human epidemiological review is required before operational action.'
              : result.aiInterpretation?.disclaimer ?? '',
          },
        };
      } catch {
        // Keep the deterministic investigation result if the LLM is unavailable.
      }

      setState(enrichedResult);

      onInvestigationComplete?.(result.trace);

      setMessages(m => [
        ...m,
        {
          id: `a-${Date.now()}`,
          sender: 'agent',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          text:
            result.dataAvailabilityStatus === 'unavailable'
              ? result.dataAvailabilityMessage ??
                `No investigation data is currently configured for ${result.activeDisease} in ${result.activeGeography}.`
              : `Investigation run complete. ${result.activeDisease} in ${result.activeGeography} produced ${result.evidence.length} evidence items. Review the anomaly, forecast, evidence chain and uncertainty before operational action.`,
        },
      ]);
    } catch (error) {
      setState(prev => ({
        ...prev,
        isInvestigating: false,
        activeStepId: null,
      }));

      setMessages(m => [
        ...m,
        {
          id: `e-${Date.now()}`,
          sender: 'agent',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          text: `The investigation could not be completed. ${
            error instanceof Error
              ? error.message
              : 'Unexpected execution error'
          }. No unsupported result was generated.`,
        },
      ]);
    }
  };

  useEffect(() => {
    if (initialPrompt && !autoRunRef.current) {
      autoRunRef.current = true;
      setStarted(true);
      setQuery(initialPrompt);
      void run(initialPrompt);
    }
  }, [initialPrompt]);

  const anomaly = state.anomaly;
  const forecast = state.forecast;

  const chart = useMemo(
    () => anomaly?.timeSeries || [],
    [anomaly],
  );

  const evidenceSummary = useMemo(() => {
    const summary = {
      observed: 0,
      derived: 0,
      model: 0,
      interpretation: 0,
      uncertainty: 0,
    };

    state.evidence.forEach(item => {
      const label = String(item.label).toUpperCase();

      if (label.includes('OBSERVED')) {
        summary.observed += 1;
      } else if (label.includes('DERIVED')) {
        summary.derived += 1;
      } else if (label.includes('MODEL')) {
        summary.model += 1;
      } else if (label.includes('INTERPRETATION')) {
        summary.interpretation += 1;
      } else if (label.includes('UNCERTAINTY')) {
        summary.uncertainty += 1;
      }
    });

    return summary;
  }, [state.evidence]);

  const max = Math.max(
    1,
    ...chart.map(x =>
      Math.max(x.observed, x.upperThreshold || 0),
    ),
  );

  const observedPath = chart
    .map(
      (p, i) =>
        `${(i / Math.max(1, chart.length - 1)) * 100},${
          100 - (p.observed / max) * 86
        }`,
    )
    .join(' ');

  const basePath = chart
    .map(
      (p, i) =>
        `${(i / Math.max(1, chart.length - 1)) * 100},${
          100 - (p.baseline / max) * 86
        }`,
    )
    .join(' ');

  const phases = useMemo(
    () =>
      INVESTIGATION_PHASES.map(phase => {
        const phaseSteps = phase.stepIndexes
          .map(index => state.steps[index])
          .filter(Boolean);

        const hasRunning = phaseSteps.some(
          step => step.status === 'running',
        );

        const allCompleted =
          phaseSteps.length > 0 &&
          phaseSteps.every(
            step => step.status === 'completed',
          );

        return {
          ...phase,
          status: allCompleted
            ? 'completed'
            : hasRunning
              ? 'running'
              : 'pending',
        };
      }),
    [state.steps],
  );

  return (
    <div className="min-h-full bg-[var(--popu-muted)] text-[var(--popu-text)]">
      <div className="max-w-[1500px] mx-auto p-5 lg:p-7 space-y-5">

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="popu-label text-[var(--popu-teal)]">
              AI Epidemiologist Investigation Workspace
            </div>

            <h1 className="text-2xl lg:text-3xl font-black tracking-tight mt-1">
              Turn a signal into an evidence-backed investigation.
            </h1>

            <p className="text-sm text-[var(--popu-sub)] mt-2 max-w-3xl">
              POPU coordinates approved data sources, statistical
              engines and evidence retrieval. It does not replace
              surveillance systems or make autonomous public-health
              decisions.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold">
            <span className="px-2.5 py-1.5 rounded-full bg-[var(--popu-warning)]/10 text-[var(--popu-warning)] border border-[var(--popu-warning)]/30">
              SYNTHETIC DEMONSTRATION DATA
            </span>

            <span className="px-2.5 py-1.5 rounded-full bg-[var(--popu-teal)]/10 text-[var(--popu-teal)] border border-[var(--popu-teal)]/30">
              HUMAN REVIEW REQUIRED
            </span>
          </div>
        </div>

        <section className="popu-surface rounded-2xl p-4 lg:p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--popu-navy)] text-white flex items-center justify-center">
              <Sparkles size={17} />
            </div>

            <div>
              <div className="popu-label">
                Quick Investigation
              </div>

              <div className="text-sm font-bold">
                Investigate an epidemiological signal
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wide text-[var(--popu-sub)] mb-1.5">
                Disease
              </label>

              <select
                value={selectedDisease}
                onChange={e =>
                  setSelectedDisease(e.target.value)
                }
                className="w-full h-11 rounded-xl border border-[var(--popu-border)] bg-[var(--popu-muted)] px-3 text-sm text-[var(--popu-text)] outline-none focus:ring-2 focus:ring-[var(--popu-teal)]/20"
              >
                <option value="cholera">Cholera</option>
                <option value="lassa fever">Lassa fever</option>
                <option value="dengue">Dengue</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wide text-[var(--popu-sub)] mb-1.5">
                Geography
              </label>

              <select
                value={selectedGeography}
                onChange={e =>
                  setSelectedGeography(e.target.value)
                }
                className="w-full h-11 rounded-xl border border-[var(--popu-border)] bg-[var(--popu-muted)] px-3 text-sm text-[var(--popu-text)] outline-none focus:ring-2 focus:ring-[var(--popu-teal)]/20"
              >
                <option value="Edo State">Edo State</option>
                <option value="Lagos State">Lagos State</option>
                <option value="Oyo State">Oyo State</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wide text-[var(--popu-sub)] mb-1.5">
                Forecast horizon
              </label>

              <select
                value={forecastHorizon}
                onChange={e =>
                  setForecastHorizon(Number(e.target.value))
                }
                className="w-full h-11 rounded-xl border border-[var(--popu-border)] bg-[var(--popu-muted)] px-3 text-sm text-[var(--popu-text)] outline-none focus:ring-2 focus:ring-[var(--popu-teal)]/20"
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
              </select>
            </div>
          </div>

          <button
            disabled={state.isInvestigating}
            onClick={() =>
              void run(
                `Investigate the ${selectedDisease} signal in ${selectedGeography}.`,
              )
            }
            className="mt-4 w-full h-11 rounded-xl bg-[var(--popu-teal)] text-white text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Play size={14} />

            {state.isInvestigating
              ? 'Investigating...'
              : 'Investigate Signal'}
          </button>

          <div className="mt-3 text-[11px] text-[var(--popu-sub)]">
            POPU will analyze the selected disease and geography
            using the configured evidence, anomaly, forecast and
            risk services.
          </div>

          {messages.length > 0 && (
            <div className="mt-3 text-xs text-[var(--popu-sub)] flex items-start gap-2">
              <BrainCircuit
                size={14}
                className="text-[var(--popu-teal)] mt-0.5"
              />

              <span>
                {messages[messages.length - 1].text}
              </span>
            </div>
          )}

          <div className="mt-5 pt-5 border-t border-[var(--popu-border)]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="popu-label">
                  Ask POPU
                </div>

                <div className="text-sm font-bold mt-1">
                  Use natural language
                </div>
              </div>

              <span className="text-[10px] font-bold text-[var(--popu-sub)]">
                ADVANCED
              </span>
            </div>

            <div className="flex gap-2">
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    void run(query);
                  }
                }}
                className="flex-1 h-11 rounded-xl border border-[var(--popu-border)] bg-[var(--popu-muted)] px-4 text-sm text-[var(--popu-text)] outline-none focus:ring-2 focus:ring-[var(--popu-teal)]/20"
                placeholder="Ask POPU what you want to investigate..."
              />

              <button
                disabled={!query.trim() || state.isInvestigating}
                onClick={() => void run(query)}
                className="px-4 h-11 rounded-xl bg-[var(--popu-navy)] text-white text-xs font-bold flex items-center gap-2 disabled:opacity-50"
              >
                <Play size={14} />

                {state.isInvestigating
                  ? 'Running...'
                  : 'Run'}
              </button>
            </div>

            <div className="mt-2 text-[11px] text-[var(--popu-sub)]">
              You can ask POPU a custom epidemiological question
              instead of using the quick investigation controls.
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          <div className="space-y-5">
            <div className="popu-surface rounded-2xl p-5">
              <div className="popu-label">
                Investigation progress
              </div>

              <div className="space-y-2 mt-4">
                {phases.map((phase, i) => (
                  <div
                    key={phase.id}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5">
                      {statusIcon(phase.status)}
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-semibold">
                        {i + 1}. {phase.label}
                      </div>

                      <div className="text-[10px] text-[var(--popu-sub)] mt-0.5 leading-relaxed">
                        {phase.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="popu-surface rounded-2xl p-5">
              <div className="popu-label">
                Intelligence result
              </div>

              <h2 className="text-lg font-black mt-1">
                {state.dataAvailabilityStatus === 'unavailable'
                  ? 'Investigation unavailable'
                  : state.riskAssessment?.signalTitle ||
                    'Waiting for investigation'}
              </h2>

              <div className="text-xs text-[var(--popu-sub)] mt-1">
                {state.activeDisease} - {state.activeGeography}
              </div>

              {state.dataAvailabilityStatus === 'unavailable' && (
                <div className="text-[10px] font-bold text-[var(--popu-warning)] mt-2">
                  No substitute geography used
                </div>
              )}

              {state.riskAssessment && (
                <div className="mt-4 pt-4 border-t border-[var(--popu-border)]">
                  <div className="popu-label">
                    Status
                  </div>

                  <div className="text-sm font-black text-[var(--popu-warning)] mt-1">
                    {state.riskAssessment.signalStatus}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5 lg:col-span-2">

            <div className="popu-surface rounded-2xl p-5">
              <div className="grid grid-cols-3 gap-3">
                <Metric
                  label="Anomaly"
                  value={
                    anomaly
                      ? `${
                          anomaly.zScore > 0 ? '+' : ''
                        }${anomaly.zScore} sigma`
                      : '-'
                  }
                  note={anomaly?.method || 'Not run'}
                />

                <Metric
                  label="Forecast score"
                  value={
                    forecast
                      ? `${forecast.riskScore}/100`
                      : '-'
                  }
                  note={
                    forecast
                      ? 'synthetic model score - not outbreak probability'
                      : 'Not run'
                  }
                />

                <Metric
                  label="Evidence"
                  value={String(state.evidence.length)}
                  note="cross-source items"
                />
              </div>

              <div className="mt-5 rounded-xl border border-[var(--popu-border)] bg-[var(--popu-muted)] p-3">
                <div className="text-[9px] uppercase tracking-[0.12em] font-black text-[var(--popu-sub)]">
                  Investigation hierarchy
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                  <HierarchyItem
                    number="01"
                    label="OBSERVED"
                    description="Source evidence"
                    value={`${state.evidence.length} items`}
                  />

                  <HierarchyItem
                    number="02"
                    label="MODEL"
                    description="Statistical outputs"
                    value={
                      anomaly
                        ? 'Anomaly run'
                        : 'Pending'
                    }
                  />

                  <HierarchyItem
                    number="03"
                    label="INTERPRET"
                    description="AI explanation"
                    value={
                      state.aiInterpretation
                        ? 'Generated'
                        : 'Pending'
                    }
                  />

                  <HierarchyItem
                    number="04"
                    label="UNCERTAINTY"
                    description="Coverage limits"
                    value={
                      state.uncertainty
                        ? `${state.uncertainty.dataCompletenessScore}%`
                        : 'Pending'
                    }
                  />

                  <HierarchyItem
                    number="05"
                    label="REVIEW"
                    description="Human verification"
                    value="Required"
                  />
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-slate-950 p-4 text-white border border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <ShieldCheck
                    size={15}
                    className="text-[var(--popu-teal)]"
                  />

                  AI interpretation - review before action
                </div>

                <p className="text-xs text-white/70 mt-2 leading-relaxed whitespace-pre-wrap">
                  {state.aiInterpretation?.interpretation ||
                    'POPU will explain the relationship between observed signals, statistical outputs and model results after the investigation completes.'}
                </p>
              </div>
            </div>

            <div className="popu-surface rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="popu-label">
                    Observed vs baseline
                  </div>

                  <h2 className="font-bold mt-1">
                    Epidemiological signal
                  </h2>
                </div>

                <span className="text-[10px] font-bold text-[var(--popu-sub)]">
                  {anomaly?.dataStatus ||
                    'MODEL OUTPUT PENDING'}
                </span>
              </div>

              {chart.length ? (
                <div className="mt-4 h-44 relative">
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="w-full h-full"
                  >
                    <polyline
                      points={basePath}
                      fill="none"
                      stroke="var(--popu-sub)"
                      strokeWidth="1.4"
                      strokeDasharray="3 3"
                    />

                    <polyline
                      points={observedPath}
                      fill="none"
                      stroke="var(--popu-teal)"
                      strokeWidth="2.2"
                    />
                  </svg>

                  <div className="absolute left-0 bottom-0 text-[9px] text-[var(--popu-sub)]">
                    historical baseline
                  </div>

                  <div className="absolute right-0 top-0 text-[9px] text-[var(--popu-teal)] font-bold">
                    observed
                  </div>
                </div>
              ) : (
                <Empty label="Run the investigation to populate the statistical series." />
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              <div className="popu-surface rounded-2xl p-5">
                <div className="popu-label">
                  Evidence chain
                </div>

                <h2 className="font-bold mt-1">
                  What supports the signal?
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4">
                  <EvidenceStatus
                    label="Observed"
                    value={evidenceSummary.observed}
                  />

                  <EvidenceStatus
                    label="Derived"
                    value={evidenceSummary.derived}
                  />

                  <EvidenceStatus
                    label="Model"
                    value={evidenceSummary.model}
                  />

                  <EvidenceStatus
                    label="Interpretation"
                    value={evidenceSummary.interpretation}
                  />

                  <EvidenceStatus
                    label="Uncertainty"
                    value={evidenceSummary.uncertainty}
                  />
                </div>

                <div className="mt-4 space-y-2">
                  {state.evidence
                    .slice(0, 7)
                    .map((e: EvidenceItem) => (
                      <div
                        key={e.id}
                        className="p-3 rounded-xl bg-[var(--popu-muted)] border border-[var(--popu-border)]"
                      >
                        <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--popu-teal)]">
                          {evidenceIcon(e.category)}

                          {e.category}

                          <span className="ml-auto text-[var(--popu-sub)]">
                            {e.label}
                          </span>
                        </div>

                        <div className="text-xs font-semibold mt-1">
                          {e.metric}: {e.value}
                        </div>

                        <div className="text-[10px] text-[var(--popu-sub)] mt-1">
                          {e.source}
                        </div>
                      </div>
                    ))}

                  {!state.evidence.length && (
                    <Empty label="Evidence will appear as tools complete." />
                  )}
                </div>
              </div>

              <div className="popu-surface rounded-2xl p-5">
                <div className="popu-label">
                  Uncertainty
                </div>

                <div className="flex items-end gap-2 mt-1">
                  <span className="text-2xl font-black">
                    {state.uncertainty
                      ? `${state.uncertainty.dataCompletenessScore}%`
                      : '-'}
                  </span>

                  <span className="text-xs text-[var(--popu-sub)] pb-1">
                    data completeness
                  </span>
                </div>

                <div className="h-2 bg-[var(--popu-muted)] rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-[var(--popu-teal)] rounded-full"
                    style={{
                      width: `${
                        state.uncertainty
                          ?.dataCompletenessScore || 0
                      }%`,
                    }}
                  />
                </div>

                <p className="text-[10px] text-[var(--popu-sub)] mt-3">
                  {state.uncertainty
                    ?.predictionIntervalDescription ||
                    'Prediction and coverage limitations will be surfaced here.'}
                </p>
              </div>

            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          <div className="popu-surface rounded-2xl p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="popu-label">
                  Model output
                </div>

                <h2 className="font-bold mt-1">
                  {forecastHorizon}-day forecast
                </h2>
              </div>

              {forecast && (
                <span className="popu-mono text-[10px] text-[var(--popu-sub)]">
                  {forecast.modelName} - {forecast.modelVersion}
                </span>
              )}
            </div>

            {forecast ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  <Metric
                    label="Forecast score"
                    value={`${forecast.riskScore}/100`}
                    note="synthetic model score - not outbreak probability"
                  />

                  <Metric
                    label="Trend"
                    value={forecast.trend.replace('_', ' ')}
                    note="forecast direction"
                  />

                  <Metric
                    label="Weekly total"
                    value={String(
                      forecast.expectedWeeklyTotal,
                    )}
                    note="expected"
                  />

                  <Metric
                    label="Interval"
                    value="95%"
                    note="prediction interval"
                  />
                </div>

                <div className="mt-4">
                  <ForecastChart forecast={forecast} />
                </div>
              </>
            ) : (
              <Empty label="Forecast service has not returned a model output yet." />
            )}
          </div>

          <div className="popu-surface rounded-2xl p-5">
            <div className="popu-label">
              Recommended investigation actions
            </div>

            <div className="space-y-3 mt-3">
              {state.recommendations
                .slice(0, 4)
                .map(r => (
                  <div
                    key={r.id}
                    className="flex gap-2"
                  >
                    <span className="w-5 h-5 shrink-0 rounded-full bg-[var(--popu-teal)]/10 text-[var(--popu-teal)] text-[9px] font-bold flex items-center justify-center">
                      {r.order}
                    </span>

                    <div>
                      <div className="text-xs font-semibold">
                        {r.action}
                      </div>

                      <div className="text-[10px] text-[var(--popu-sub)] mt-0.5">
                        {r.owner} - {r.urgency}
                      </div>
                    </div>
                  </div>
                ))}

              {!state.recommendations.length && (
                <Empty label="Recommendations appear after evidence fusion." />
              )}
            </div>
          </div>

        </section>

        {state.trace && (
          <InvestigationTraceView trace={state.trace} />
        )}

        <div className="popu-surface rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--popu-warning)]/10 text-[var(--popu-warning)] flex items-center justify-center">
            <AlertTriangle size={17} />
          </div>

          <div className="flex-1">
            <div className="text-xs font-black">
              Human review is mandatory
            </div>

            <div className="text-[10px] text-[var(--popu-sub)] mt-0.5">
              POPU produces intelligence and recommendations
              for review. It does not issue autonomous public-health
              action orders.
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--popu-teal)]">
            <ShieldCheck size={14} />
            Review required
          </div>
        </div>

      </div>
    </div>
  );
};

function HierarchyItem({
  number,
  label,
  description,
  value,
}: {
  number: string;
  label: string;
  description: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-[var(--popu-surface)] border border-[var(--popu-border)] px-2.5 py-2">
      <div className="text-[9px] font-black text-[var(--popu-teal)]">
        {number} {label}
      </div>

      <div className="text-[10px] text-[var(--popu-sub)] mt-1">
        {description}
      </div>

      <div className="text-xs font-bold mt-1">
        {value}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-xl bg-[var(--popu-muted)] border border-[var(--popu-border)] p-3">
      <div className="popu-label">
        {label}
      </div>

      <div className="text-lg font-black mt-1 capitalize">
        {value}
      </div>

      <div className="text-[9px] text-[var(--popu-sub)] mt-0.5">
        {note}
      </div>
    </div>
  );
}

function EvidenceStatus({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg bg-[var(--popu-muted)] border border-[var(--popu-border)] px-2.5 py-2">
      <div className="text-[9px] uppercase tracking-wide font-bold text-[var(--popu-sub)]">
        {label}
      </div>

      <div className="text-sm font-black mt-0.5">
        {value}
      </div>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--popu-border)] bg-[var(--popu-muted)] p-5 text-center text-xs text-[var(--popu-sub)]">
      {label}
    </div>
  );
}



