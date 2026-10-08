import React from 'react';
import {
  Activity,
  AlertTriangle,
  BellRing,
  Bot,
  BrainCircuit,
  ClipboardCheck,
  Database,
  FileSearch,
  Gauge,
  Globe2,
  History,
  Map,
  Settings,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

interface Props {
  currentView: string;
  onSelectView: (view: string) => void;
  isInvestigating?: boolean;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const groups = [
  {
    label: 'Intelligence',
    items: [
      ['agent', 'Agent Workspace', Bot],
      ['signals', 'Signals', Activity],
      ['investigations', 'Investigations', ClipboardCheck],
      ['alerts', 'Alerts', BellRing],
      ['anomalies', 'Anomalies', AlertTriangle],
      ['forecasts', 'Forecasts', TrendingUp],
    ],
  },
  {
    label: 'Analysis',
    items: [
      ['surveillance', 'Surveillance', Gauge],
      ['diseases', 'Diseases', BrainCircuit],
      ['geography', 'Geography', Map],
      ['datasources', 'Data Sources', Database],
    ],
  },
  {
    label: 'Governance',
    items: [
      ['models', 'Models', FileSearch],
      ['audit', 'Audit Trail', History],
      ['settings', 'Settings', Settings],
    ],
  },
] as const;

export const Sidebar: React.FC<Props> = ({
  currentView,
  onSelectView,
  mobileOpen = false,
  onCloseMobile,
}) => (
  <>
    {/* Desktop Sidebar */}
    <aside className="w-[232px] shrink-0 hidden md:flex flex-col bg-[var(--popu-surface)] text-[var(--popu-text)] border-r border-[var(--popu-border)] overflow-y-auto">

      <div className="p-3 border-b border-[var(--popu-border)]">
        <div className="px-3 py-2.5 rounded-xl bg-[var(--popu-muted)] border border-[var(--popu-border)]">
          <div className="popu-label text-[var(--popu-teal)]">
            Operational scope
          </div>

          <div className="flex items-center gap-2 mt-1 text-sm font-bold">
            <Globe2 size={15} className="text-[var(--popu-teal)]" />
            Nigeria
          </div>

          <div className="text-[10px] text-[var(--popu-sub)] mt-1">
            National → State → LGA → Facility
          </div>
        </div>
      </div>

      <nav className="p-3 space-y-5 flex-1">
        {groups.map((g) => (
          <div key={g.label}>
            <div className="popu-label px-3 mb-2">
              {g.label}
            </div>

            <div className="space-y-1">
              {g.items.map(([id, label, Icon]) => (
                <button
                  key={id}
                  onClick={() => onSelectView(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition ${
                    currentView === id
                      ? 'bg-[var(--popu-navy)] text-[var(--popu-surface)]'
                      : 'text-[var(--popu-sub)] hover:bg-[var(--popu-muted)] hover:text-[var(--popu-text)]'
                  }`}
                >
                  <Icon size={16} />

                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-[var(--popu-border)]">
        <div className="rounded-xl bg-[var(--popu-navy)] text-[var(--popu-surface)] p-3">
          <div className="flex items-center gap-2 text-xs font-bold">
            <ShieldCheck
              size={15}
              className="text-[var(--popu-teal)]"
            />
            Governance active
          </div>

          <div className="text-[10px] text-[var(--popu-sub)] mt-2 leading-relaxed">
            Synthetic data is isolated. Operational decisions require human review.
          </div>

          <div className="mt-3 text-[9px] font-mono text-[var(--popu-teal)]">
            DEMO MODE · REVIEW REQUIRED
          </div>
        </div>
      </div>
    </aside>

    {/* Mobile Sidebar */}
    {mobileOpen && (
      <>
        <div
          className="fixed inset-0 z-40 bg-[var(--popu-navy)]/50 md:hidden"
          onClick={onCloseMobile}
        />

        <aside className="fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] bg-[var(--popu-surface)] text-[var(--popu-text)] shadow-2xl md:hidden overflow-y-auto">

          <div className="p-4 border-b border-[var(--popu-border)] flex items-center justify-between">
            <div>
              <div className="font-black text-lg text-[var(--popu-text)]">
                POPU
              </div>

              <div className="text-[9px] uppercase tracking-[.16em] text-[var(--popu-sub)] mt-1">
                Navigation
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="w-9 h-9 rounded-lg border border-[var(--popu-border)] flex items-center justify-center text-[var(--popu-sub)] hover:bg-[var(--popu-muted)] hover:text-[var(--popu-text)] transition-colors"
              aria-label="Close navigation"
            >
              ×
            </button>
          </div>

          <nav className="p-3 space-y-5">
            {groups.map((g) => (
              <div key={g.label}>
                <div className="popu-label px-3 mb-2">
                  {g.label}
                </div>

                <div className="space-y-1">
                  {g.items.map(([id, label, Icon]) => (
                    <button
                      key={id}
                      onClick={() => onSelectView(id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-xs font-semibold text-left transition ${
                        currentView === id
                          ? 'bg-[var(--popu-navy)] text-[var(--popu-surface)]'
                          : 'text-[var(--popu-sub)] hover:bg-[var(--popu-muted)] hover:text-[var(--popu-text)]'
                      }`}
                    >
                      <Icon size={17} />

                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-3 border-t border-[var(--popu-border)]">
            <div className="rounded-xl bg-[var(--popu-navy)] text-[var(--popu-surface)] p-3">
              <div className="flex items-center gap-2 text-xs font-bold">
                <ShieldCheck
                  size={15}
                  className="text-[var(--popu-teal)]"
                />
                Governance active
              </div>

              <div className="text-[10px] text-[var(--popu-sub)] mt-2 leading-relaxed">
                Synthetic data is isolated. Operational decisions require human review.
              </div>

              <div className="mt-3 text-[9px] font-mono text-[var(--popu-teal)]">
                DEMO MODE · REVIEW REQUIRED
              </div>
            </div>
          </div>
        </aside>
      </>
    )}
  </>
);
