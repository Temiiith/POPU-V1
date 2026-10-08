import React, { useState } from 'react';
import { ToolExecution } from '../../types/agent';
import {
  Terminal,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ToolExecutionCardProps {
  tool: ToolExecution;
}

export const ToolExecutionCard: React.FC<ToolExecutionCardProps> = ({ tool }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="popu-surface border border-[var(--popu-border)] rounded-xl overflow-hidden text-xs font-mono transition-all">
      {/* Header bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-3.5 py-2.5 flex items-center justify-between cursor-pointer hover:bg-[var(--popu-muted)] select-none"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {tool.status === 'completed' && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}

          {tool.status === 'running' && (
            <Loader2 className="w-4 h-4 text-[var(--popu-teal)] animate-spin shrink-0" />
          )}

          {tool.status === 'failed' && (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}

          {tool.status === 'pending' && (
            <div className="w-4 h-4 rounded-full border border-[var(--popu-border)] shrink-0" />
          )}

          <div className="flex items-center gap-2 truncate">
            <span className="text-[var(--popu-teal)] font-semibold truncate">
              {tool.name}()
            </span>

            <span className="text-[var(--popu-sub)] hidden sm:inline">-</span>

            <span className="text-[var(--popu-sub)] text-[11px] truncate hidden sm:inline">
              {tool.description}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-2">
          <span className="text-[var(--popu-sub)] text-[11px]">
            {tool.executionTimeMs}ms
          </span>

          <span className="text-[10px] text-[var(--popu-sub)] bg-[var(--popu-muted)] px-1.5 py-0.5 rounded border border-[var(--popu-border)]">
            {tool.dataSource}
          </span>

          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-[var(--popu-sub)]" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[var(--popu-sub)]" />
          )}
        </div>
      </div>

      {/* Expanded I/O Inspector */}
      {isExpanded && (
        <div className="p-3 bg-[var(--popu-muted)] border-t border-[var(--popu-border)]/80 text-[11px] space-y-2">
          <div>
            <div className="text-[var(--popu-sub)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-[var(--popu-sub)]" />
              <span>Input Parameters</span>
            </div>

            <pre className="bg-[var(--popu-muted)] p-2 rounded text-[var(--popu-sub)] overflow-x-auto border border-[var(--popu-border)]">
              {JSON.stringify(tool.inputs, null, 2)}
            </pre>
          </div>

          {tool.outputs && (
            <div>
              <div className="text-[var(--popu-sub)] uppercase tracking-wider mb-1">
                Tool Output Payload
              </div>

              <pre className="bg-[var(--popu-muted)] p-2 rounded text-[var(--popu-teal)] overflow-x-auto border border-[var(--popu-border)]">
                {JSON.stringify(tool.outputs, null, 2)}
              </pre>
            </div>
          )}

          {tool.errorState && (
            <div className="p-2 bg-rose-950/20 border border-rose-800/60 rounded text-rose-300">
              Error: {tool.errorState}
            </div>
          )}

          <div className="text-[10px] text-[var(--popu-sub)] pt-1 flex items-center justify-between">
            <span>Data Status: {tool.dataStatus.toUpperCase()}</span>
            <span>Target Backend: FastAPI / Python ML Suite</span>
          </div>
        </div>
      )}
    </div>
  );
};