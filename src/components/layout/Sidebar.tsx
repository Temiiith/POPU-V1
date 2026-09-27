import React from 'react';
import { Activity, AlertTriangle, BellRing, Bot, BrainCircuit, ClipboardCheck, Database, FileSearch, Gauge, Globe2, History, Map, Settings, ShieldCheck, TrendingUp } from 'lucide-react';

interface Props { currentView:string; onSelectView:(view:string)=>void; isInvestigating?:boolean }
const groups=[
 {label:'Intelligence',items:[['agent','Agent Workspace',Bot],['signals','Signals',Activity],['investigations','Investigations',ClipboardCheck],['alerts','Alerts',BellRing],['anomalies','Anomalies',AlertTriangle],['forecasts','Forecasts',TrendingUp]]},
 {label:'Analysis',items:[['surveillance','Surveillance',Gauge],['diseases','Diseases',BrainCircuit],['geography','Geography',Map],['datasources','Data Sources',Database]]},
 {label:'Governance',items:[['models','Models',FileSearch],['audit','Audit Trail',History],['settings','Settings',Settings]]}
] as const;
export const Sidebar:React.FC<Props>=({currentView,onSelectView})=>(
 <aside className="w-[232px] shrink-0 hidden md:flex flex-col bg-white border-r border-[#dce5e8] overflow-y-auto">
  <div className="p-3 border-b border-[#edf1f2]"><div className="px-3 py-2.5 rounded-xl bg-[#eef8f7] border border-[#d5eeeb]"><div className="popu-label text-[#08766f]">Operational scope</div><div className="flex items-center gap-2 mt-1 text-sm font-bold"><Globe2 size={15} className="text-[#0f8f86]"/>Nigeria</div><div className="text-[10px] text-[#64747b] mt-1">National → State → LGA → Facility</div></div></div>
  <nav className="p-3 space-y-5 flex-1">{groups.map(g=><div key={g.label}><div className="popu-label px-3 mb-2">{g.label}</div><div className="space-y-1">{g.items.map(([id,label,Icon])=><button key={id} onClick={()=>onSelectView(id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition ${currentView===id?'bg-[#102a33] text-white':'text-[#506168] hover:bg-[#f4f7f8] hover:text-[#102027]'}`}><Icon size={16}/><span>{label}</span>{id==='alerts'&&<span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-[#fbe8e7] text-[#b33a35]">3</span>}</button>)}</div></div>)}</nav>
  <div className="p-3 border-t border-[#edf1f2]"><div className="rounded-xl bg-[#102a33] text-white p-3"><div className="flex items-center gap-2 text-xs font-bold"><ShieldCheck size={15} className="text-[#58c8bd]"/>Governance active</div><div className="text-[10px] text-slate-300 mt-2 leading-relaxed">Synthetic data is isolated. Operational decisions require human review.</div><div className="mt-3 text-[9px] font-mono text-[#8edbd4]">DEMO MODE · REVIEW REQUIRED</div></div></div>
 </aside>
);
