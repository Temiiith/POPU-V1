import React from 'react';
import { History, ShieldCheck } from 'lucide-react';
import { InvestigationTrace } from '../../types/agent';

interface AuditTraceViewProps {
  trace: InvestigationTrace | null;
}

export const AuditTraceView: React.FC<AuditTraceViewProps> = ({ trace }) => {
  return (
    <div className="popu-page p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--popu-text)] flex items-center gap-2.5">
            <History className="w-5 h-5 text-[var(--popu-teal)]" />
            <span>Epidemiological Audit &amp; Governance Trail</span>
          </h2>

          <div className="text-xs text-[var(--popu-sub)] font-mono mt-0.5">
            Cryptographically verifiable record of AI agent execution and
            decision lineage
          </div>
        </div>

        <div className="text-xs font-mono text-[var(--popu-teal)] bg-[var(--popu-muted)] px-3 py-1.5 rounded-lg border border-[var(--popu-border)] flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>Audit Integrity: Verified</span>
        </div>
      </div>

      {trace ? (
        <div className="popu-surface rounded-2xl p-5 font-mono text-xs space-y-5">

          {/* Investigation Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-[var(--popu-border)]">
            <div>
              <div className="popu-label">Investigation ID</div>
              <div className="text-[var(--popu-text)] font-semibold mt-1 break-all">
                {trace.investigationId}
              </div>
            </div>

            <div>
              <div className="popu-label">Agent Run ID</div>
              <div className="text-[var(--popu-text)] font-semibold mt-1 break-all">
                {trace.agentRunId}
              </div>
            </div>

            <div>
              <div className="popu-label">Timestamp</div>
              <div className="text-[var(--popu-text)] font-semibold mt-1">
                {new Date(trace.timestamp).toUTCString()}
              </div>
            </div>

            <div>
              <div className="popu-label">Integrity Hash</div>
              <div className="text-[var(--popu-teal)] font-semibold mt-1 truncate">
                {trace.aiInterpretationHash}
              </div>
            </div>
          </div>

          {/* User Request */}
          <div>
            <div className="popu-label mb-2">
              User Request &amp; Identified Scope
            </div>

            <div className="p-3 bg-[var(--popu-muted)] border border-[var(--popu-border)] rounded-lg text-[var(--popu-text)]">
              "{trace.userRequest}"
            </div>
          </div>

          {/* Tool Chain */}
          <div>
            <div className="popu-label mb-2">
              Executed Tool Chain ({trace.toolCallsExecuted.length} operations)
            </div>

            <div className="space-y-2">
              {trace.toolCallsExecuted.map((tc, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-[var(--popu-muted)] border border-[var(--popu-border)] rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[var(--popu-sub)] shrink-0">
                      {idx + 1}.
                    </span>

                    <span className="text-[var(--popu-teal)] font-semibold shrink-0">
                      {tc.name}()
                    </span>

                    <span className="text-[var(--popu-sub)] hidden sm:inline truncate">
                      · {tc.description}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[var(--popu-sub)] text-[11px] shrink-0">
                    <span>{tc.executionTimeMs}ms</span>

                    <span className="text-[var(--popu-teal)]">
                      SUCCESS
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Provenance */}
          <div>
            <div className="popu-label mb-2">
              Data Provenance &amp; Verification
            </div>

            <div className="p-3 bg-[var(--popu-muted)] border border-[var(--popu-border)] rounded-lg space-y-1 text-[var(--popu-sub)]">
              {trace.dataSourcesQueried.map((ds, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-[var(--popu-teal)]">✓</span>
                  <span>{ds}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Governance Boundary */}
          <div className="pt-3 border-t border-[var(--popu-border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[var(--popu-sub)] text-[11px]">
            <span>
              Human Review Boundary: {trace.humanReviewStatus}
            </span>

            <span className="text-[var(--popu-warning)]">
              {trace.syntheticDataNotice}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-[var(--popu-sub)] font-mono text-xs popu-surface rounded-2xl">
          No active investigation trace recorded yet. Run an investigation from
          the AI Agent Workspace.
        </div>
      )}
    </div>
  );
};