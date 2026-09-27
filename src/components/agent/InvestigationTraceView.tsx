import React, { useState } from 'react';
import { InvestigationTrace } from '../../types/agent';
import { GitBranch, ShieldCheck, ChevronDown, ChevronUp, Clock, CheckCircle } from 'lucide-react';

interface InvestigationTraceViewProps {
  trace: InvestigationTrace;
}

export const InvestigationTraceView: React.FC<InvestigationTraceViewProps> = ({ trace }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden font-mono text-xs">
      {/* Collapsible header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-850 select-none border-b border-slate-800"
      >
        <div className="flex items-center gap-2.5">
          <GitBranch className="w-4 h-4 text-teal-400" />
          <div>
            <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>Investigation Trace & Audit Trail</span>
              <span className="text-xs text-slate-400 font-normal">({trace.investigationId})</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Deterministic lineage from user intent to clinical recommendation
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
            {trace.humanReviewStatus}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {/* Expanded Trace Graph and Node Inspection */}
      {isExpanded && (
        <div className="p-5 space-y-5 bg-slate-950/90">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-slate-800 text-[11px]">
            <div>
              <div className="text-slate-500 uppercase">Investigation ID</div>
              <div className="text-slate-200 font-semibold mt-0.5">{trace.investigationId}</div>
            </div>
            <div>
              <div className="text-slate-500 uppercase">Agent Run ID</div>
              <div className="text-slate-200 font-semibold mt-0.5">{trace.agentRunId}</div>
            </div>
            <div>
              <div className="text-slate-500 uppercase">Timestamp</div>
              <div className="text-slate-200 font-semibold mt-0.5">{new Date(trace.timestamp).toLocaleTimeString()}</div>
            </div>
            <div>
              <div className="text-slate-500 uppercase">Integrity Hash</div>
              <div className="text-teal-400 font-semibold mt-0.5 truncate">{trace.aiInterpretationHash}</div>
            </div>
          </div>

          {/* Sequential Execution Lineage Nodes */}
          <div>
            <div className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] mb-3">
              Deterministic Execution Lineage
            </div>

            <div className="space-y-3 relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {/* Step 1: User Request */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-teal-500 ring-4 ring-slate-950"></span>
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
                  <div className="text-slate-400 text-[10px] uppercase">1. User Intent Prompt</div>
                  <div className="text-slate-200 font-sans text-xs mt-0.5 font-medium">"{trace.userRequest}"</div>
                </div>
              </div>

              {/* Step 2: Agent Tool Calls */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-teal-500 ring-4 ring-slate-950"></span>
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
                  <div className="text-slate-400 text-[10px] uppercase">
                    2. Tool Calls Executed ({trace.toolCallsExecuted.length} functions)
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {trace.toolCallsExecuted.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-slate-950 border border-slate-700 rounded text-teal-300 text-[10px]"
                      >
                        {t.name}()
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 3: Anomaly & Forecast Engines */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-teal-500 ring-4 ring-slate-950"></span>
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
                  <div className="text-slate-400 text-[10px] uppercase">3. Mathematical & Algorithmic Engines</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5 text-[11px]">
                    <div className="text-slate-300">
                      <span className="text-slate-500">Anomaly Engine:</span> {trace.anomalyEngine}
                    </div>
                    <div className="text-slate-300">
                      <span className="text-slate-500">Forecast Engine:</span> {trace.forecastEngine}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Evidence Synthesis */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-teal-500 ring-4 ring-slate-950"></span>
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
                  <div className="text-slate-400 text-[10px] uppercase">4. Evidence Fusion</div>
                  <div className="text-slate-300 text-[11px] mt-0.5">
                    {trace.evidenceItemsCount} multi-modal evidence objects indexed across surveillance, hospital, lab, and environmental feeds.
                  </div>
                </div>
              </div>

              {/* Step 5: Clinical Recommendation & Human Review */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-slate-950"></span>
                <div className="p-2.5 bg-slate-900 border border-amber-500/40 rounded">
                  <div className="text-amber-400 text-[10px] uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    5. Human Review Boundary
                  </div>
                  <div className="text-slate-300 text-[11px] mt-0.5">
                    State Epidemiologist sign-off required prior to field deployment or public alert dissemination.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Synthetic Banner */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded text-amber-400 text-[11px] flex items-center justify-between">
            <span>{trace.syntheticDataNotice}</span>
            <span className="text-slate-400">Audit Compliance: ISO/IEC 27001 Ready</span>
          </div>
        </div>
      )}
    </div>
  );
};
