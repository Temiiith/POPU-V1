import React, { useState } from 'react';
import { EvidenceItem, EvidenceCategory } from '../../types/agent';
import { Database } from 'lucide-react';

interface EvidencePanelProps {
  evidence: EvidenceItem[];
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  evidence,
}) => {
  const [filterCategory, setFilterCategory] =
    useState<string>('ALL');

  const categories: (EvidenceCategory | 'ALL')[] = [
    'ALL',
    'SURVEILLANCE',
    'HOSPITAL',
    'LABORATORY',
    'ENVIRONMENT',
    'GEOGRAPHIC',
  ];

  const filtered =
    filterCategory === 'ALL'
      ? evidence
      : evidence.filter(
          e => e.category === filterCategory,
        );

  return (
    <div className="popu-surface border border-[var(--popu-border)] rounded-2xl p-5">
      {/* Header and Category Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--popu-border)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--popu-sub)]">
            <span>EVIDENCE FUSION</span>
            <span aria-hidden="true">-</span>
            <span>{evidence.length} Signals Captured</span>
          </div>

          <h4 className="text-base font-semibold text-[var(--popu-text)] mt-1 flex items-center gap-2">
            <Database className="w-4 h-4 text-[var(--popu-teal)]" />
            Epidemiological Evidence Matrix
          </h4>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-[var(--popu-muted)] p-1 rounded-md border border-[var(--popu-border)] overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-[var(--popu-surface)] text-[var(--popu-teal)] font-semibold'
                  : 'text-[var(--popu-sub)] hover:text-[var(--popu-text)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Evidence Items List */}
      <div className="mt-4 space-y-3">
        {filtered.map(item => (
          <div
            key={item.id}
            className="p-4 bg-[var(--popu-muted)]/80 border border-[var(--popu-border)] rounded-xl transition-colors hover:border-[var(--popu-teal)]/30"
          >
            {/* Metadata row */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[var(--popu-sub)] pb-2 border-b border-[var(--popu-border)]">
              <div className="flex items-center gap-2">
                <span className="text-[var(--popu-teal)] font-semibold">
                  {item.category}
                </span>

                <span aria-hidden="true">-</span>

                <span className="text-[var(--popu-sub)]">
                  {item.geography}
                </span>

                <span aria-hidden="true">-</span>

                <span className="text-[var(--popu-sub)]">
                  {item.timestamp}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    item.label === 'OBSERVED DATA'
                      ? 'border-[var(--popu-teal)]/30 text-[var(--popu-teal)] bg-[var(--popu-muted)]'
                      : item.label === 'DERIVED STATISTIC'
                        ? 'border-[var(--popu-warning)]/30 text-[var(--popu-warning)] bg-[var(--popu-warning)]/10'
                        : 'border-[var(--popu-teal)]/30 text-[var(--popu-teal)] bg-[var(--popu-muted)]'
                  }`}
                >
                  {item.label}
                </span>

                <span
                  className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                    item.status === 'critical'
                      ? 'bg-[var(--popu-danger)]/20 text-[var(--popu-danger)] border-[var(--popu-danger)]/30'
                      : 'bg-[var(--popu-warning)]/20 text-[var(--popu-warning)] border-[var(--popu-warning)]/30'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>

            {/* Core metric and value */}
            <div className="mt-2.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <div className="text-sm font-semibold text-[var(--popu-text)]">
                  {item.metric}
                </div>

                <div className="text-xs text-[var(--popu-sub)] mt-0.5">
                  {item.dataType}
                </div>
              </div>

              <div className="text-right">
                <div className="text-base font-mono font-semibold text-[var(--popu-teal)]">
                  {item.value}
                </div>

                {item.baselineComparison && (
                  <div className="text-xs text-[var(--popu-sub)] mt-0.5">
                    {item.baselineComparison}
                  </div>
                )}
              </div>
            </div>

            {/* Source info */}
            <div className="mt-3 pt-2 border-t border-[var(--popu-border)] flex flex-wrap items-center justify-between text-[11px] font-mono text-[var(--popu-sub)] gap-2">
              <span>
                Source: {item.source}
              </span>

              <span className="text-[var(--popu-warning)] font-medium">
                {item.syntheticTag}
              </span>
            </div>
          </div>
        ))}

        {!filtered.length && (
          <div className="rounded-xl border border-dashed border-[var(--popu-border)] bg-[var(--popu-muted)] p-5 text-center text-xs text-[var(--popu-sub)]">
            No evidence matches the selected category.
          </div>
        )}
      </div>
    </div>
  );
};