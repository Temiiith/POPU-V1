import React from 'react';
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Bot,
  Database,
  ArrowRight,
} from 'lucide-react';
import StatusTag from '../ui/StatusTag';

interface DashboardViewProps {
  onInvestigatePrompt: (prompt: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onInvestigatePrompt,
}) => {
  return (
    <div className="popu-page p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">

      {/* Disclaimer */}
      <div className="p-3 bg-[var(--popu-muted)] border border-[var(--popu-border)] rounded-lg flex items-center justify-between text-xs font-mono text-[var(--popu-warning)]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--popu-warning)] animate-pulse" />
          <span className="font-semibold">
            SYNTHETIC DEMONSTRATION DATA:
          </span>
          <span className="text-[var(--popu-sub)]">
            All metrics below represent simulated scenarios for algorithmic
            evaluation.
          </span>
        </div>

        <span className="text-[11px] text-[var(--popu-sub)] hidden sm:inline">
          Nigeria Public Health Simulator
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[var(--popu-text)]">
            National Epidemiological Surveillance Monitor
          </h2>

          <div className="text-xs text-[var(--popu-sub)] font-mono mt-0.5">
            Real-time anomaly ingestion &amp; automated signal triage across
            36 States &amp; FCT
          </div>
        </div>

        <button
          onClick={() =>
            onInvestigatePrompt(
              'Investigate the cholera signal in Edo State.',
            )
          }
          className="px-4 py-2 bg-[var(--popu-teal)] hover:bg-[var(--popu-teal-dark)] text-white text-xs font-semibold rounded-md flex items-center gap-2 transition-colors self-start shadow-sm"
        >
          <Bot className="w-4 h-4" />
          <span>Launch AI Agent Investigation</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="p-4 popu-surface rounded-2xl">
          <div className="text-xs uppercase font-mono text-[var(--popu-sub)] flex items-center justify-between">
            <span>Active Signals</span>
            <AlertTriangle className="w-4 h-4 text-[var(--popu-danger)]" />
          </div>

          <div className="text-2xl font-mono font-bold text-[var(--popu-danger)] mt-2">
            3
            <span className="text-xs font-normal text-[var(--popu-sub)]">
              {' '}
              signals
            </span>
          </div>

          <div className="text-xs text-[var(--popu-danger)] font-mono mt-1">
            1 Elevated signal (synthetic)
          </div>
        </div>

        <div className="p-4 popu-surface rounded-2xl">
          <div className="text-xs uppercase font-mono text-[var(--popu-sub)] flex items-center justify-between">
            <span>Statistical Anomalies</span>
            <Activity className="w-4 h-4 text-[var(--popu-warning)]" />
          </div>

          <div className="text-2xl font-mono font-bold text-[var(--popu-warning)] mt-2">
            8
            <span className="text-xs font-normal text-[var(--popu-sub)]">
              {' '}
              LGAs
            </span>
          </div>

          <div className="text-xs text-[var(--popu-warning)] font-mono mt-1">
            Z-score &gt; +2.5σ in 4 councils
          </div>
        </div>

        <div className="p-4 popu-surface rounded-2xl">
          <div className="text-xs uppercase font-mono text-[var(--popu-sub)] flex items-center justify-between">
            <span>Open Investigations</span>
            <Bot className="w-4 h-4 text-[var(--popu-teal)]" />
          </div>

          <div className="text-2xl font-mono font-bold text-[var(--popu-teal)] mt-2">
            2
            <span className="text-xs font-normal text-[var(--popu-sub)]">
              {' '}
              in progress
            </span>
          </div>

          <div className="text-xs text-[var(--popu-teal)] font-mono mt-1">
            Human review pending
          </div>
        </div>

        <div className="p-4 popu-surface rounded-2xl">
          <div className="text-xs uppercase font-mono text-[var(--popu-sub)] flex items-center justify-between">
            <span>Data Ingestion Health</span>
            <Database className="w-4 h-4 text-[var(--popu-teal)]" />
          </div>

          <div className="text-2xl font-mono font-bold text-[var(--popu-teal)] mt-2">
            94.8%
            <span className="text-xs font-normal text-[var(--popu-sub)]">
              {' '}
              uptime
            </span>
          </div>

          <div className="text-xs text-[var(--popu-teal)] font-mono mt-1">
            5 Synthetic adapters connected
          </div>
        </div>
      </div>

      {/* Active Disease Signals Table */}
      <div className="popu-surface rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--popu-border)] flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[var(--popu-text)]">
              Priority Triaged Disease Signals
            </h3>

            <div className="text-xs text-[var(--popu-sub)] font-mono mt-0.5">
              Ranked by combined anomaly score, velocity, and environmental
              risk
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--popu-muted)] text-[var(--popu-sub)] font-mono uppercase tracking-wider text-[11px] border-b border-[var(--popu-border)]">
              <tr>
                <th className="px-5 py-3">Disease</th>
                <th className="px-5 py-3">Jurisdiction</th>
                <th className="px-5 py-3">Signal Level</th>
                <th className="px-5 py-3">Observed vs Baseline</th>
                <th className="px-5 py-3">Anomaly Z-Score</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--popu-border)]">

              <tr className="hover:bg-[var(--popu-muted)] transition-colors">
                <td className="px-5 py-4 font-semibold text-[var(--popu-text)]">
                  Cholera
                </td>

                <td className="px-5 py-4 font-mono text-[var(--popu-sub)]">
                  Edo State (Egor, Ikpoba-Okha, Oredo)
                </td>

                <td className="px-5 py-4">
                  <StatusTag label="Elevated Signal" tone="danger" />
                </td>

                <td className="px-5 py-4 font-mono text-[var(--popu-danger)]">
                  62 cases/wk vs 15.1 (+310%)
                </td>

                <td className="px-5 py-4 font-mono text-[var(--popu-warning)]">
                  +3.82 σ
                </td>

                <td className="px-5 py-4">
                  <button
                    onClick={() =>
                      onInvestigatePrompt(
                        'Investigate the cholera signal in Edo State.',
                      )
                    }
                    className="px-2.5 py-1 text-xs font-medium text-[var(--popu-teal)] bg-[var(--popu-muted)] hover:bg-[var(--popu-surface)] border border-[var(--popu-border)] rounded flex items-center gap-1 transition-colors"
                  >
                    <span>Investigate</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-[var(--popu-muted)] transition-colors">
                <td className="px-5 py-4 font-semibold text-[var(--popu-text)]">
                  Lassa fever
                </td>

                <td className="px-5 py-4 font-mono text-[var(--popu-sub)]">
                  Edo State (Esan West, Irrua)
                </td>

                <td className="px-5 py-4">
                  <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-[var(--popu-muted)] text-[var(--popu-warning)] border border-[var(--popu-border)]">
                    Elevated Signal
                  </span>
                </td>

                <td className="px-5 py-4 font-mono text-[var(--popu-warning)]">
                  21 cases/wk vs 4.8 (+337%)
                </td>

                <td className="px-5 py-4 font-mono text-[var(--popu-warning)]">
                  +2.94 σ
                </td>

                <td className="px-5 py-4">
                  <button
                    onClick={() =>
                      onInvestigatePrompt(
                        'Investigate Lassa fever signal in Edo State.',
                      )
                    }
                    className="px-2.5 py-1 text-xs font-medium text-[var(--popu-sub)] bg-[var(--popu-muted)] hover:bg-[var(--popu-surface)] border border-[var(--popu-border)] rounded flex items-center gap-1 transition-colors"
                  >
                    <span>Investigate</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-[var(--popu-muted)] transition-colors">
                <td className="px-5 py-4 font-semibold text-[var(--popu-text)]">
                  Dengue
                </td>

                <td className="px-5 py-4 font-mono text-[var(--popu-sub)]">
                  Lagos State (Alimosho, Ikeja)
                </td>

                <td className="px-5 py-4">
                  <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-[var(--popu-muted)] text-[var(--popu-sub)] border border-[var(--popu-border)]">
                    Baseline Monitoring
                  </span>
                </td>

                <td className="px-5 py-4 font-mono text-[var(--popu-sub)]">
                  8 cases/wk vs 7.2 (+11%)
                </td>

                <td className="px-5 py-4 font-mono text-[var(--popu-sub)]">
                  +0.48 σ
                </td>

                <td className="px-5 py-4">
                  <button
                    onClick={() =>
                      onInvestigatePrompt(
                        'Investigate dengue activity in Lagos State.',
                      )
                    }
                    className="px-2.5 py-1 text-xs font-medium text-[var(--popu-sub)] bg-[var(--popu-muted)] hover:bg-[var(--popu-surface)] border border-[var(--popu-border)] rounded flex items-center gap-1 transition-colors"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* High-Signal LGAs and Data Source Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="popu-surface rounded-2xl p-5">
          <h4 className="text-sm font-semibold text-[var(--popu-text)] flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-[var(--popu-teal)]" />
            <span>High-Signal Local Government Areas (LGAs)</span>
          </h4>

          <div className="space-y-2.5">
            {[
              {
                lga: 'Egor (Edo)',
                disease: 'Cholera',
                cases: 26,
                z: '+3.9σ',
                status: 'High Anomaly',
              },
              {
                lga: 'Oredo (Edo)',
                disease: 'Cholera',
                cases: 18,
                z: '+2.8σ',
                status: 'Elevated',
              },
              {
                lga: 'Ikpoba-Okha (Edo)',
                disease: 'Cholera',
                cases: 12,
                z: '+2.4σ',
                status: 'Flooding Risk',
              },
              {
                lga: 'Esan West (Edo)',
                disease: 'Lassa fever',
                cases: 11,
                z: '+3.1σ',
                status: 'Elevated',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-[var(--popu-muted)] border border-[var(--popu-border)] rounded-lg flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-[var(--popu-text)]">
                    {item.lga}
                  </div>

                  <div className="text-[11px] text-[var(--popu-sub)] font-mono">
                    Target: {item.disease} · {item.cases} cases
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-[var(--popu-warning)] font-semibold">
                    {item.z}
                  </div>

                  <div className="text-[10px] text-[var(--popu-sub)]">
                    {item.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="popu-surface rounded-2xl p-5">
          <h4 className="text-sm font-semibold text-[var(--popu-text)] flex items-center gap-2 mb-3">
            <Database className="w-4 h-4 text-[var(--popu-teal)]" />
            <span>Data-Source Adapter Health</span>
          </h4>

          <div className="space-y-2.5 font-mono text-xs">
            {[
              {
                name: 'SORMAS / IDSR Ingestion Adapter',
                latency: '24ms',
                health: 'Operational',
                type: 'Synthetic Feed',
              },
              {
                name: 'Sentinel Secondary Hospital EHR Gateway',
                latency: '48ms',
                health: 'Operational',
                type: 'Synthetic Feed',
              },
              {
                name: 'Public Health Reference Lab LIMS',
                latency: '61ms',
                health: 'Operational',
                type: 'Synthetic Feed',
              },
              {
                name: 'Hydro-Meteorological Satellite Engine',
                latency: '35ms',
                health: 'Operational',
                type: 'Synthetic Feed',
              },
            ].map((feed, idx) => (
              <div
                key={idx}
                className="p-3 bg-[var(--popu-muted)] border border-[var(--popu-border)] rounded-lg flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-[var(--popu-text)]">
                    {feed.name}
                  </div>

                  <div className="text-[11px] text-[var(--popu-sub)]">
                    {feed.type}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[var(--popu-teal)] font-semibold">
                    {feed.health}
                  </div>

                  <div className="text-[10px] text-[var(--popu-sub)]">
                    {feed.latency}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};