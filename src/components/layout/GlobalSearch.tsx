import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Database,
  FileSearch,
  Globe2,
  Search,
  ShieldCheck,
  TrendingUp,
  X,
} from 'lucide-react';
import {
  NIGERIA_GEOGRAPHY,
  NIGERIA_LGAS,
} from '../../data/nigeriaGeography';
import {
  PLATFORM_DISEASES,
  PLATFORM_SIGNALS,
} from '../../data/platformSearch';

interface SearchResult {
  id: string;
  type: string;
  title: string;
  description: string;
  view?: string;
  prompt?: string;
  icon: React.ElementType;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  onLaunch: (prompt: string) => void;
  investigationHistory: import('../../types/agent').InvestigationTrace[];
}

const sections = [
  ['investigations', 'Investigations', 'Review investigation records', FileSearch],
  ['alerts', 'Alerts', 'Review intelligence alerts', AlertTriangle],
  ['anomalies', 'Anomalies', 'Explore statistical anomalies', Activity],
  ['forecasts', 'Forecasts', 'Explore forecast outputs', TrendingUp],
  ['surveillance', 'Surveillance', 'Review surveillance streams', BarChart3],
  ['geography', 'Geography', 'Explore Nigeria geographic intelligence', Globe2],
  ['datasources', 'Data sources', 'Review connected and synthetic sources', Database],
  ['models', 'Models', 'Review analytical models', ShieldCheck],
  ['audit', 'Audit trail', 'Review traceable agent runs', FileSearch],
];

export const GlobalSearch: React.FC<Props> = ({
  open,
  onClose,
  onNavigate,
  onLaunch,
  investigationHistory,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  const results = useMemo<SearchResult[]>(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return [];
    }

    const matches: SearchResult[] = [];

    investigationHistory.forEach((trace) => {
      const searchable = [
        trace.investigationId,
        trace.userRequest,
        trace.intentIdentified,
        trace.dataSourcesQueried.join(' '),
      ]
        .join(' ')
        .toLowerCase();

      if (searchable.includes(normalized)) {
        matches.push({
          id: `investigation-${trace.investigationId}`,
          type: 'INVESTIGATION',
          title: trace.intentIdentified.replace(
            'Backend investigation: ',
            '',
          ),
          description: `${trace.riskLevel} risk · ${trace.riskScore}/100 · ${trace.evidenceItemsCount} evidence items`,
          view: 'agent',
          prompt: trace.userRequest,
          icon: FileSearch,
        });
      }
    });

    PLATFORM_SIGNALS.forEach((signal) => {
      const searchable =
        `${signal.id} ${signal.disease} ${signal.geo} ${signal.level} ${signal.source}`.toLowerCase();

      if (searchable.includes(normalized)) {
        matches.push({
          id: signal.id,
          type: 'SIGNAL',
          title: `${signal.disease} — ${signal.geo}`,
          description: `${signal.level} · ${signal.source}`,
          view: 'signals',
          prompt: `Investigate the ${signal.disease} signal in ${signal.geo}.`,
          icon: Activity,
        });
      }
    });

    PLATFORM_DISEASES.forEach((disease) => {
      if (
        `${disease.name} ${disease.category}`
          .toLowerCase()
          .includes(normalized)
      ) {
        matches.push({
          id: `disease-${disease.name}`,
          type: 'DISEASE',
          title: disease.name,
          description: disease.category,
          view: 'diseases',
          prompt: `Investigate the ${disease.name} signal in Edo State.`,
          icon: Activity,
        });
      }
    });

    [...NIGERIA_GEOGRAPHY, ...NIGERIA_LGAS].forEach((geography) => {
      const searchable = [
        geography.name,
        geography.level,
        ...geography.aliases,
      ]
        .join(' ')
        .toLowerCase();

      if (searchable.includes(normalized)) {
        matches.push({
          id: `geography-${geography.id}`,
          type: geography.level.toUpperCase(),
          title: geography.name,
          description:
            geography.level === 'LGA'
              ? 'Configured geographic intelligence area'
              : 'Nigeria administrative geography',
          view: 'geography',
          icon: Globe2,
        });
      }
    });

    sections.forEach(([view, title, description, icon]) => {
      if (`${title} ${description}`.toLowerCase().includes(normalized)) {
        matches.push({
          id: `section-${view}`,
          type: 'PLATFORM',
          title,
          description,
          view,
          icon,
        });
      }
    });

    return matches.slice(0, 8);
  }, [query, investigationHistory]);

  if (!open) return null;

  const handleResult = (result: SearchResult) => {
    onClose();

    if (result.prompt) {
      onLaunch(result.prompt);
      return;
    }

    if (result.view) {
      onNavigate(result.view);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[var(--popu-navy)]/50 flex items-start justify-center p-5 pt-[10vh]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-2xl bg-[var(--popu-surface)] text-[var(--popu-text)] border border-[var(--popu-border)] rounded-2xl shadow-2xl overflow-hidden">

        <div className="flex items-center gap-3 px-4 h-14 border-b border-[var(--popu-border)]">
          <Search
            size={18}
            className="text-[var(--popu-sub)]"
          />

          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search investigations, signals, diseases, locations..."
            className="flex-1 h-full outline-none text-sm bg-transparent text-[var(--popu-text)] placeholder:text-[var(--popu-sub)]"
          />

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--popu-muted)] text-[var(--popu-sub)] hover:text-[var(--popu-text)] transition-colors"
            aria-label="Close search"
          >
            <X size={17} />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto">
          {!query.trim() ? (
            <div className="p-8 text-center">
              <Search
                size={24}
                className="mx-auto text-[var(--popu-sub)]"
              />

              <div className="text-sm font-bold mt-3">
                Search across POPU
              </div>

              <div className="text-xs text-[var(--popu-sub)] mt-1">
                Find signals, diseases, platform sections and configured
                geographies.
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-sm font-bold">
                No results found
              </div>

              <div className="text-xs text-[var(--popu-sub)] mt-1">
                Try a disease, signal, location or platform section.
              </div>
            </div>
          ) : (
            <div className="p-2">
              <div className="popu-label px-3 py-2">
                Search results
              </div>

              {results.map((result) => {
                const Icon = result.icon;

                return (
                  <button
                    key={result.id}
                    onClick={() => handleResult(result)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-[var(--popu-muted)] transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[var(--popu-muted)] border border-[var(--popu-border)] flex items-center justify-center text-[var(--popu-teal)] shrink-0">
                      <Icon size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="popu-label">
                          {result.type}
                        </span>
                      </div>

                      <div className="text-xs font-bold mt-1">
                        {result.title}
                      </div>

                      <div className="text-[10px] text-[var(--popu-sub)] mt-0.5 truncate">
                        {result.description}
                      </div>
                    </div>

                    <ArrowRight
                      size={15}
                      className="text-[var(--popu-sub)] shrink-0"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};