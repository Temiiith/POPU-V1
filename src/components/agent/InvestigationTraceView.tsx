import React, { useState } from 'react';
import { InvestigationTrace } from '../../types/agent';
import {
  GitBranch,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface InvestigationTraceViewProps {
  trace: InvestigationTrace;
}

export const InvestigationTraceView: React.FC<InvestigationTraceViewProps> = ({
  trace,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="popu-surface rounded-2xl overflow-hidden font-mono text-xs">
      {/* Collapsible header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-[var(--popu-muted)] select-none border-b border-[var(--popu-border)]"
      >
        <div className="flex items-center gap-2.5">
          <GitBranch className="w-4 h-4 text-[var(--popu-teal)]" />

          <div>
            <div className="text-sm font-semibold text-[var(--popu-text)] flex items-center gap-2">
              <span>Investigation Trace & Audit Trail</span>

              <span className="text-xs text-[var(--popu-sub)] font-normal">
                ({trace.investigationId})
              </span>
            </div>

            <div className="text-[11px] text-[var(--popu-sub)] mt-0.5">
              Deterministic lineage from user intent to clinical recommendation
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[var(--popu-teal)] bg-[var(--popu-muted)] px-2 py-0.5 rounded-lg border border-[var(--popu-border)]">
            {trace.humanReviewStatus}
          </span>

          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-[var(--popu-sub)]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[var(--popu-sub)]" />
          )}
        </div>
      </div>

      {/* Expanded Trace Graph and Node Inspection */}
      {isExpanded && (
        <div className="p-5 space-y-5 bg-[var(--popu-muted)]">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-[var(--popu-border)] text-[11px]">
            <div>
              <div className="popu-label">Investigation ID</div>
              <div className="text-[var(--popu-text)] font-semibold mt-0.5">
                {trace.investigationId}
              </div>
            </div>

            <div>
              <div className="popu-label">Agent Run ID</div>
              <div className="text-[var(--popu-text)] font-semibold mt-0.5">
                {trace.agentRunId}
              </div>
            </div>

            <div>
              <div className="popu-label">Timestamp</div>
              <div className="text-[var(--popu-text)] font-semibold mt-0.5">
                {new Date(trace.timestamp).toLocaleTimeString()}
              </div>
            </div>

            <div>
              <div className="popu-label">Integrity Hash</div>
              <div className="text-[var(--popu-teal)] font-semibold mt-0.5 truncate">
                {trace.aiInterpretationHash}
              </div>
            </div>
          </div>

          {/* Sequential Execution Lineage Nodes */}
          <div>
            <div className="popu-label mb-3">
              Deterministic Execution Lineage
            </div>

            <div className="space-y-3 relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--popu-border)]">
              {/* Step 1 */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[var(--popu-teal)] ring-4 ring-[var(--popu-muted)]" />

                <div className="p-2.5 popu-surface rounded-xl">
                  <div className="popu-label">
                    1. User Intent Prompt
                  </div>

                  <div className="text-[var(--popu-text)] font-sans text-xs mt-0.5 font-medium">
                    "{trace.userRequest}"
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[var(--popu-teal)] ring-4 ring-[var(--popu-muted)]" />

                <div className="p-2.5 popu-surface rounded-xl">
                  <div className="popu-label">
                    2. Tool Calls Executed ({trace.toolCallsExecuted.length}{' '}
                    functions)
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {trace.toolCallsExecuted.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-[var(--popu-muted)] border border-[var(--popu-border)] rounded-lg text-[var(--popu-teal)] text-[10px]"
                      >
                        {t.name}()
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[var(--popu-teal)] ring-4 ring-[var(--popu-muted)]" />

                <div className="p-2.5 popu-surface rounded-xl">
                  <div className="popu-label">
                    3. Mathematical & Algorithmic Engines
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5 text-[11px]">
                    <div className="text-[var(--popu-text)]">
                      <span className="text-[var(--popu-sub)]">
                        Anomaly Engine:
                      </span>{' '}
                      {trace.anomalyEngine}
                    </div>

                    <div className="text-[var(--popu-text)]">
                      <span className="text-[var(--popu-sub)]">
                        Forecast Engine:
                      </span>{' '}
                      {trace.forecastEngine}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[var(--popu-teal)] ring-4 ring-[var(--popu-muted)]" />

                <div className="p-2.5 popu-surface rounded-xl">
                  <div className="popu-label">
                    4. Evidence Fusion
                  </div>

                  <div className="text-[var(--popu-sub)] text-[11px] mt-0.5">
                    {trace.evidenceItemsCount} multi-modal evidence objects
                    indexed across surveillance, hospital, lab, and
                    environmental feeds.
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[var(--popu-warning)] ring-4 ring-[var(--popu-muted)]" />

                <div className="p-2.5 bg-[var(--popu-muted)] border border-[var(--popu-warning)] rounded-xl">
                  <div className="text-[var(--popu-warning)] text-[10px] uppercase flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    5. Human Review Boundary
                  </div>

                  <div className="text-[var(--popu-sub)] text-[11px] mt-0.5">
                    State Epidemiologist sign-off required prior to field
                    deployment or public alert dissemination.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Synthetic Banner */}
          <div className="p-3 bg-[var(--popu-muted)] border border-[var(--popu-warning)] rounded-xl text-[var(--popu-warning)] text-[11px] flex items-center justify-between gap-3">
            <span>{trace.syntheticDataNotice}</span>

            <span className="text-[var(--popu-sub)]">
              Audit Compliance: ISO/IEC 27001 Ready
            </span>
          </div>
        </div>
      )}
    </div>
  );
};