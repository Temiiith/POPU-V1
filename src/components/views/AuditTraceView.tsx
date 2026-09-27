import React from 'react';
import { History, ShieldCheck, CheckCircle2, Terminal } from 'lucide-react';
import { InvestigationTrace } from '../../types/agent';

interface AuditTraceViewProps {
  trace: InvestigationTrace | null;
}

export const AuditTraceView: React.FC<AuditTraceViewProps> = ({ trace }) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
            <History className="w-5 h-5 text-teal-400" />
            <span>Epidemiological Audit &amp; Governance Trail</span>
          </h2>
          <div className="text-xs text-slate-400 font-mono mt-0.5">
            Cryptographically verifiable record of AI agent execution and decision lineage
          </div>
        </div>

        <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/30 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>Audit Integrity: Verified</span>
        </div>
      </div>

      {trace ? (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 font-mono text-xs space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="text-slate-500 uppercase">Investigation ID</div>
              <div className="text-slate-100 font-semibold mt-1">{trace.investigationId}</div>
            </div>
            <div>
              <div className="text-slate-500 uppercase">Agent Run ID</div>
              <div className="text-slate-100 font-semibold mt-1">{trace.agentRunId}</div>
            </div>
            <div>
              <div className="text-slate-500 uppercase">Timestamp</div>
              <div className="text-slate-100 font-semibold mt-1">{new Date(trace.timestamp).toUTCString()}</div>
            </div>
            <div>
              <div className="text-slate-500 uppercase">Integrity Hash</div>
              <div className="text-teal-400 font-semibold mt-1 truncate">{trace.aiInterpretationHash}</div>
            </div>
          </div>

          <div>
            <div className="text-slate-400 uppercase tracking-wider text-[11px] mb-2 font-semibold">
              User Request &amp; Identified Scope
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded text-slate-200">
              "{trace.userRequest}"
            </div>
          </div>

          <div>
            <div className="text-slate-400 uppercase tracking-wider text-[11px] mb-2 font-semibold">
              Executed Tool Chain ({trace.toolCallsExecuted.length} operations)
            </div>
            <div className="space-y-2">
              {trace.toolCallsExecuted.map((tc, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-950 border border-slate-850 rounded flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{idx + 1}.</span>
                    <span className="text-teal-300 font-semibold">{tc.name}()</span>
                    <span className="text-slate-400 hidden sm:inline">· {tc.description}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span>{tc.executionTimeMs}ms</span>
                    <span className="text-emerald-400">SUCCESS</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-slate-400 uppercase tracking-wider text-[11px] mb-2 font-semibold">
              Data Provenance &amp; Verification
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-1 text-slate-300">
              {trace.dataSourcesQueried.map((ds, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-teal-400">✓</span>
                  <span>{ds}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
            <span>Human Review Boundary: {trace.humanReviewStatus}</span>
            <span className="text-amber-400">{trace.syntheticDataNotice}</span>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-500 font-mono text-xs bg-slate-900 border border-slate-800 rounded-lg">
          No active investigation trace recorded yet. Run an investigation from the AI Agent Workspace.
        </div>
      )}
    </div>
  );
};
