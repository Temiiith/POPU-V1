import React, { useState } from 'react';
import { EvidenceItem, EvidenceCategory } from '../../types/agent';
import { Database, Filter } from 'lucide-react';

interface EvidencePanelProps {
  evidence: EvidenceItem[];
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ evidence }) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const categories: (EvidenceCategory | 'ALL')[] = [
    'ALL',
    'SURVEILLANCE',
    'HOSPITAL',
    'LABORATORY',
    'ENVIRONMENT',
    'GEOGRAPHIC',
  ];

  const filtered = filterCategory === 'ALL'
    ? evidence
    : evidence.filter(e => e.category === filterCategory);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
      {/* Header and Category Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>EVIDENCE FUSION</span>
            <span aria-hidden="true">·</span>
            <span>{evidence.length} Signals Captured</span>
          </div>
          <h4 className="text-base font-semibold text-slate-100 mt-1 flex items-center gap-2">
            <Database className="w-4 h-4 text-teal-400" />
            Epidemiological Evidence Matrix
          </h4>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-md border border-slate-800 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-slate-800 text-teal-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
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
            className="p-4 bg-slate-950/80 border border-slate-800/90 rounded-md transition-colors hover:border-slate-700"
          >
            {/* Metadata row */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400 pb-2 border-b border-slate-850">
              <div className="flex items-center gap-2">
                <span className="text-teal-400 font-semibold">{item.category}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-300">{item.geography}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-500">{item.timestamp}</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    item.label === 'OBSERVED DATA'
                      ? 'border-blue-500/30 text-blue-300 bg-blue-500/10'
                      : item.label === 'DERIVED STATISTIC'
                      ? 'border-amber-500/30 text-amber-300 bg-amber-500/10'
                      : 'border-purple-500/30 text-purple-300 bg-purple-500/10'
                  }`}
                >
                  {item.label}
                </span>

                <span
                  className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                    item.status === 'critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>

            {/* Core metric and value */}
            <div className="mt-2.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <div className="text-sm font-semibold text-slate-100">{item.metric}</div>
                <div className="text-xs text-slate-400 mt-0.5">{item.dataType}</div>
              </div>

              <div className="text-right">
                <div className="text-base font-mono font-semibold text-teal-300">{item.value}</div>
                {item.baselineComparison && (
                  <div className="text-xs text-slate-400 mt-0.5">{item.baselineComparison}</div>
                )}
              </div>
            </div>

            {/* Source info */}
            <div className="mt-3 pt-2 border-t border-slate-900 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 gap-2">
              <span>Source: {item.source}</span>
              <span className="text-amber-500/90 font-medium">
                {item.syntheticTag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
