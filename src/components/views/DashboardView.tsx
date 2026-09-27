import React from 'react';
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Bot,
  Database,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface DashboardViewProps {
  onInvestigatePrompt: (prompt: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onInvestigatePrompt }) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Disclaimer */}
      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-between text-xs font-mono text-amber-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="font-semibold">SYNTHETIC DEMONSTRATION DATA:</span>
          <span>All metrics below represent simulated scenarios for algorithmic evaluation.</span>
        </div>
        <span className="text-[11px] text-amber-500/90 hidden sm:inline">Nigeria Public Health Simulator</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-100">National Epidemiological Surveillance Monitor</h2>
          <div className="text-xs text-slate-400 font-mono mt-0.5">
            Real-time anomaly ingestion &amp; automated signal triage across 36 States &amp; FCT
          </div>
        </div>

        <button
          onClick={() => onInvestigatePrompt('Investigate the cholera signal in Edo State.')}
          className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold rounded-md flex items-center gap-2 transition-colors self-start shadow-sm"
        >
          <Bot className="w-4 h-4" />
          <span>Launch AI Agent Investigation</span>
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="text-xs uppercase font-mono text-slate-400 flex items-center justify-between">
            <span>Active Signals</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-rose-400 mt-2">
            3 <span className="text-xs font-normal text-slate-400">signals</span>
          </div>
          <div className="text-xs text-rose-400/80 font-mono mt-1">1 Elevated signal (synthetic)</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="text-xs uppercase font-mono text-slate-400 flex items-center justify-between">
            <span>Statistical Anomalies</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-amber-400 mt-2">
            8 <span className="text-xs font-normal text-slate-400">LGAs</span>
          </div>
          <div className="text-xs text-amber-400/80 font-mono mt-1">Z-score &gt; +2.5σ in 4 councils</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="text-xs uppercase font-mono text-slate-400 flex items-center justify-between">
            <span>Open Investigations</span>
            <Bot className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-teal-400 mt-2">
            2 <span className="text-xs font-normal text-slate-400">in progress</span>
          </div>
          <div className="text-xs text-teal-400/80 font-mono mt-1">Human review pending</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="text-xs uppercase font-mono text-slate-400 flex items-center justify-between">
            <span>Data Ingestion Health</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400 mt-2">
            94.8% <span className="text-xs font-normal text-slate-400">uptime</span>
          </div>
          <div className="text-xs text-emerald-400/80 font-mono mt-1">5 Synthetic adapters connected</div>
        </div>
      </div>

      {/* Active Disease Signals Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-100">Priority Triaged Disease Signals</h3>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              Ranked by combined anomaly score, velocity, and environmental risk
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">Disease</th>
                <th className="px-5 py-3">Jurisdiction</th>
                <th className="px-5 py-3">Signal Level</th>
                <th className="px-5 py-3">Observed vs Baseline</th>
                <th className="px-5 py-3">Anomaly Z-Score</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {/* Row 1: Kwara Cholera */}
              <tr className="hover:bg-slate-850/60 transition-colors">
                <td className="px-5 py-4 font-semibold text-slate-100">Cholera</td>
                <td className="px-5 py-4 font-mono text-slate-300">Edo State (Egor, Ikpoba-Okha, Oredo)</td>
                <td className="px-5 py-4">
                  <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Elevated Signal
                  </span>
                </td>
                <td className="px-5 py-4 font-mono text-rose-400">
                  62 cases/wk vs 15.1 (+310%)
                </td>
                <td className="px-5 py-4 font-mono text-amber-400">+3.82 σ</td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => onInvestigatePrompt('Investigate the cholera signal in Edo State.')}
                    className="px-2.5 py-1 text-xs font-medium text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 rounded flex items-center gap-1 transition-colors"
                  >
                    <span>Investigate</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>

              {/* Row 2: Edo Lassa */}
              <tr className="hover:bg-slate-850/60 transition-colors">
                <td className="px-5 py-4 font-semibold text-slate-100">Lassa fever</td>
                <td className="px-5 py-4 font-mono text-slate-300">Edo State (Esan West, Irrua)</td>
                <td className="px-5 py-4">
                  <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Elevated Signal
                  </span>
                </td>
                <td className="px-5 py-4 font-mono text-amber-300">
                  21 cases/wk vs 4.8 (+337%)
                </td>
                <td className="px-5 py-4 font-mono text-amber-400">+2.94 σ</td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => onInvestigatePrompt('Investigate Lassa fever signal in Edo State.')}
                    className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded flex items-center gap-1 transition-colors"
                  >
                    <span>Investigate</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>

              {/* Row 3: Lagos Dengue */}
              <tr className="hover:bg-slate-850/60 transition-colors">
                <td className="px-5 py-4 font-semibold text-slate-100">Dengue</td>
                <td className="px-5 py-4 font-mono text-slate-300">Lagos State (Alimosho, Ikeja)</td>
                <td className="px-5 py-4">
                  <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    Baseline Monitoring
                  </span>
                </td>
                <td className="px-5 py-4 font-mono text-slate-300">
                  8 cases/wk vs 7.2 (+11%)
                </td>
                <td className="px-5 py-4 font-mono text-slate-400">+0.48 σ</td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => onInvestigatePrompt('Investigate dengue activity in Lagos State.')}
                    className="px-2.5 py-1 text-xs font-medium text-slate-400 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 rounded flex items-center gap-1 transition-colors"
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
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg">
          <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-teal-400" />
            <span>High-Signal Local Government Areas (LGAs)</span>
          </h4>
          <div className="space-y-2.5">
            {[
              { lga: 'Egor (Edo)', disease: 'Cholera', cases: 26, z: '+3.9σ', status: 'High Anomaly' },
              { lga: 'Oredo (Edo)', disease: 'Cholera', cases: 18, z: '+2.8σ', status: 'Elevated' },
              { lga: 'Ikpoba-Okha (Edo)', disease: 'Cholera', cases: 12, z: '+2.4σ', status: 'Flooding Risk' },
              { lga: 'Esan West (Edo)', disease: 'Lassa fever', cases: 11, z: '+3.1σ', status: 'Elevated' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-950 border border-slate-850 rounded flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-200">{item.lga}</div>
                  <div className="text-[11px] text-slate-400 font-mono">Target: {item.disease} · {item.cases} cases</div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-amber-400 font-semibold">{item.z}</div>
                  <div className="text-[10px] text-slate-500">{item.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg">
          <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2 mb-3">
            <Database className="w-4 h-4 text-teal-400" />
            <span>Data-Source Adapter Health</span>
          </h4>
          <div className="space-y-2.5 font-mono text-xs">
            {[
              { name: 'SORMAS / IDSR Ingestion Adapter', latency: '24ms', health: 'Operational', type: 'Synthetic Feed' },
              { name: 'Sentinel Secondary Hospital EHR Gateway', latency: '48ms', health: 'Operational', type: 'Synthetic Feed' },
              { name: 'Public Health Reference Lab LIMS', latency: '61ms', health: 'Operational', type: 'Synthetic Feed' },
              { name: 'Hydro-Meteorological Satellite Engine', latency: '35ms', health: 'Operational', type: 'Synthetic Feed' },
            ].map((feed, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-950 border border-slate-850 rounded flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-slate-200">{feed.name}</div>
                  <div className="text-[11px] text-slate-400">{feed.type}</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-semibold">{feed.health}</div>
                  <div className="text-[10px] text-slate-500">{feed.latency}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
