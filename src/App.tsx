import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AgentWorkspace } from './components/agent/AgentWorkspace';
import { Activity, AlertTriangle, BellRing, CheckCircle2, ChevronRight, Database, Globe2, History, ShieldCheck, TrendingUp, X } from 'lucide-react';
import {
  FCT_GEOGRAPHY,
  getGeographyAvailability,
  getHealthFacilityStatus,
  getLGAsForState,
  NIGERIA_GEOGRAPHY,
  NIGERIA_LGAS,
} from './data/nigeriaGeography';
import { getDataRegistrySummary } from './data/dataRegistry';

const signals=[
 {id:'SIG-001',disease:'Cholera',geo:'Edo State',level:'Elevated signal',source:'Surveillance + hospital + laboratory',time:'Today',tone:'amber'},
 {id:'SIG-002',disease:'Lassa fever',geo:'Edo State',level:'Requires investigation',source:'Syndromic surveillance + lab',time:'Today',tone:'red'},
 {id:'SIG-003',disease:'Dengue',geo:'Lagos State',level:'Baseline monitoring',source:'Surveillance',time:'Yesterday',tone:'teal'},
];
const diseases=[['Cholera','Waterborne / fecal-oral','Surveillance, laboratory, hospital, environmental'],['Lassa fever','Zoonotic / nosocomial','Surveillance, laboratory, hospital, geography'],['Dengue','Vector-borne','Surveillance, weather, geography, laboratory']];
const sources=[['Integrated surveillance','Cases, trends, reporting completeness','Adapter ready','Synthetic'],['Hospital signals','Syndromic admissions and capacity','Adapter ready','Synthetic'],['Laboratory','Positivity and confirmations','Adapter ready','Synthetic'],['Environment / weather','Rainfall, flooding, water indicators','Adapter ready','Synthetic'],['Mobility / community','Approved aggregate movement signals','Future adapter','Pending']];

export default function App(){
 const [view,setView]=useState('agent'); const [prompt,setPrompt]=useState(''); const [brief,setBrief]=useState(false);
 const launch=(p:string)=>{setPrompt(p);setView('agent')};
 return <div className="min-h-screen bg-[#f4f7f8] text-[#102027] flex flex-col">
  <Navbar currentView={view} onSelectView={setView} onNewInvestigation={()=>launch('Investigate the cholera signal in Edo State.')} onOpenBrief={()=>setBrief(true)}/>
  <div className="flex flex-1 min-h-0"><Sidebar currentView={view} onSelectView={setView}/><main className="flex-1 min-w-0 overflow-y-auto">
   {view==='agent'&&<AgentWorkspace initialPrompt={prompt}/>} 
   {view!=='agent'&&<ViewRouter view={view} launch={launch}/>} 
  </main></div>
  {brief&&<Brief onClose={()=>setBrief(false)} onOpen={()=>{setBrief(false);setView('agent')}}/>}
 </div>
}
function ViewRouter({view,launch}:{view:string;launch:(p:string)=>void}){
 const titles:Record<string,string>={dashboard:'National intelligence overview',signals:'Signals',investigations:'Investigations',alerts:'Alerts',anomalies:'Anomalies',forecasts:'Forecasts',surveillance:'Surveillance',diseases:'Diseases',geography:'Geography',datasources:'Data sources',models:'Models',audit:'Audit trail',settings:'Settings'};
 return <div className="max-w-[1450px] mx-auto p-5 lg:p-7 space-y-5">
  <div><div className="popu-label text-[#0f8f86]">POPU Intelligence Layer</div><h1 className="text-2xl font-black tracking-tight mt-1">{titles[view]||'Intelligence'}</h1><p className="text-sm text-[#64747b] mt-1">Supporting intelligence surfaces for investigation—not a replacement for source surveillance systems.</p></div>
  {view==='dashboard'&&<Dashboard launch={launch}/>} {view==='signals'&&<Signals launch={launch}/>} {view==='investigations'&&<Investigations launch={launch}/>} {view==='alerts'&&<Alerts launch={launch}/>} {view==='anomalies'&&<Anomalies launch={launch}/>} {view==='forecasts'&&<Forecasts launch={launch}/>} {view==='surveillance'&&<Surveillance launch={launch}/>} {view==='diseases'&&<Diseases launch={launch}/>} {view==='geography'&&<Geography launch={launch}/>} {view==='datasources'&&<DataSources/>} {view==='models'&&<Models/>} {view==='audit'&&<Audit/>} {view==='settings'&&<Settings/>}
 </div>
}
function Dashboard({launch}:{launch:(p:string)=>void}){return <><div className="grid grid-cols-2 xl:grid-cols-4 gap-4"><Stat icon={Activity} label="Signals requiring review" value="3" note="Across monitored demo feeds"/><Stat icon={AlertTriangle} label="Anomalies" value="2" note="Statistical detection outputs"/><Stat icon={TrendingUp} label="Forecasts" value="6" note="Active model outputs"/><Stat icon={Database} label="Source health" value="5/6" note="One adapter pending"/></div><div className="grid lg:grid-cols-3 gap-5"><Panel title="Current intelligence signals" className="lg:col-span-2"><SignalsTable launch={launch}/></Panel><Panel title="Agent workflow"><Workflow/></Panel></div><Panel title="POPU operating principle"><div className="grid md:grid-cols-4 gap-3">{['Observe','Detect','Investigate','Explain'].map((x,i)=><div key={x} className="p-4 rounded-xl bg-[#f8fafb] border border-[#e4ebed]"><div className="text-[10px] font-bold text-[#0f8f86]">0{i+1}</div><div className="font-bold text-sm mt-2">{x}</div><div className="text-[10px] text-[#718188] mt-1">{['Ingest approved signals.','Run statistical detection.','Coordinate multi-source checks.','Present evidence and uncertainty.'][i]}</div></div>)}</div></Panel></>}
function Signals({launch}:{launch:(p:string)=>void}){return <Panel title="Detected signals"><SignalsTable launch={launch}/></Panel>}
function SignalsTable({launch}:{launch:(p:string)=>void}){return <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="popu-label border-b border-[#e4ebed]"><th className="py-3">Signal</th><th>Disease</th><th>Geography</th><th>Status</th><th>Evidence</th><th/></tr></thead><tbody>{signals.map(s=><tr key={s.id} className="border-b border-[#eef2f3] last:border-0"><td className="py-4"><div className="font-mono text-[10px] text-[#64747b]">{s.id}</div><div className="text-xs font-bold mt-1">{s.time}</div></td><td className="text-xs font-semibold">{s.disease}</td><td className="text-xs">{s.geo}</td><td><span className={`text-[10px] font-bold px-2 py-1 rounded-full ${s.tone==='red'?'bg-[#fbe8e7] text-[#b33a35]':s.tone==='amber'?'bg-[#fff8ea] text-[#9a6111]':'bg-[#eef8f7] text-[#08766f]'}`}>{s.level}</span></td><td className="text-[10px] text-[#64747b]">{s.source}</td><td><button onClick={()=>launch(`Investigate the ${s.disease} signal in ${s.geo}.`)} className="text-[10px] font-bold text-[#08766f] flex items-center gap-1">Investigate <ChevronRight size={13}/></button></td></tr>)}</tbody></table></div>}
function Investigations({launch}:{launch:(p:string)=>void}){return <div className="space-y-3">{['INV-2026-NGA-0924','INV-2026-NGA-0918','INV-2026-NGA-0907'].map((id,i)=><Panel key={id} title={id}><div className="flex flex-col md:flex-row md:items-center gap-4"><div className="flex-1"><div className="text-sm font-bold">{['Cholera signal investigation','Lassa fever syndromic signal','Dengue geographic review'][i]}</div><div className="text-xs text-[#64747b] mt-1">{['Edo State · Evidence fusion in progress','Edo State · Awaiting laboratory verification','Lagos State · Baseline monitoring'][i]}</div></div><span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#fff8ea] text-[#9a6111]">Human review</span><button onClick={()=>launch(['Investigate the cholera signal in Edo State.','Investigate the Lassa fever signal in Edo State.','Investigate the dengue signal in Lagos State.'][i])} className="px-3 py-2 rounded-lg border border-[#dce5e8] text-xs font-bold">Open in agent</button></div></Panel>)}</div>}
function Alerts({launch}:{launch:(p:string)=>void}){return <div className="space-y-3">{signals.filter(s=>s.tone!=='teal').map(s=><Panel key={s.id} title={s.level}><div className="flex gap-4"><div className="w-10 h-10 rounded-xl bg-[#fff8ea] flex items-center justify-center text-[#c47a18]"><BellRing size={18}/></div><div className="flex-1"><div className="text-sm font-bold">{s.disease} · {s.geo}</div><div className="text-xs text-[#64747b] mt-1">{s.source}. This is an intelligence signal requiring validation, not a confirmed outbreak declaration.</div></div><button onClick={()=>launch(`Investigate the ${s.disease} signal in ${s.geo}.`)} className="px-3 py-2 rounded-lg bg-[#102a33] text-white text-xs font-bold">Triage with POPU</button></div></Panel>)}</div>}
function Anomalies({launch}:{launch:(p:string)=>void}){return <div className="grid md:grid-cols-2 gap-5"><Panel title="Statistical anomaly detection"><div className="space-y-4">{[['Cholera','Edo State','+3.82σ','Z-score'],['Lassa fever','Edo State','+2.91σ','EWMA']].map(x=><div key={x[0]} className="p-4 rounded-xl bg-[#f8fafb] border border-[#e4ebed]"><div className="flex justify-between"><div><div className="text-sm font-bold">{x[0]}</div><div className="text-[10px] text-[#64747b]">{x[1]} · synthetic model output</div></div><div className="text-right"><div className="text-lg font-black text-[#c47a18]">{x[2]}</div><div className="popu-label">{x[3]}</div></div></div><button onClick={()=>launch(`Investigate the ${x[0]} signal in ${x[1]}.`)} className="mt-3 text-[10px] font-bold text-[#08766f]">Open investigation →</button></div>)}</div></Panel><Panel title="Detection methods"><div className="grid grid-cols-2 gap-3">{['Rolling baseline','Seasonal baseline','Z-score','EWMA','CUSUM','Isolation Forest'].map(x=><div key={x} className="p-3 border border-[#e4ebed] rounded-xl text-xs font-semibold">{x}<div className="text-[9px] text-[#718188] mt-1">Deterministic statistical layer</div></div>)}</div></Panel></div>}
function Forecasts({launch}:{launch:(p:string)=>void}){return <div className="grid md:grid-cols-2 gap-5"><Panel title="Forecast outputs"><div className="space-y-3">{[['Cholera','Edo State','14 days','78/100'],['Lassa fever','Edo State','14 days','61/100'],['Dengue','Lagos State','14 days','42/100']].map(x=><div key={x[0]} className="p-4 border border-[#e4ebed] rounded-xl flex items-center gap-4"><TrendingUp size={18} className="text-[#0f8f86]"/><div className="flex-1"><div className="text-sm font-bold">{x[0]} · {x[1]}</div><div className="text-[10px] text-[#64747b] mt-1">{x[2]} · model output · synthetic demonstration data</div></div><div className="text-lg font-black">{x[3]}</div></div>)}</div></Panel><Panel title="Forecast governance"><div className="text-xs leading-relaxed text-[#64747b]">Forecast values come from a numerical forecasting service. The language model must not invent probabilities or replace the forecasting engine. Prediction intervals and model version are displayed with every forecast.</div><button onClick={()=>launch('What is the 14-day forecast for the current signal?')} className="mt-4 px-3 py-2 bg-[#0f8f86] text-white rounded-lg text-xs font-bold">Ask POPU to explain a forecast</button></Panel></div>}
function Surveillance({launch}:{launch:(p:string)=>void}){return <div className="grid lg:grid-cols-2 gap-5"><Panel title="Routine surveillance streams"><div className="h-52 rounded-xl bg-[#f8fafb] border border-[#e4ebed] p-4"><div className="flex items-end gap-2 h-full">{[18,24,19,27,22,31,46,39,58,62].map((n,i)=><div key={i} className="flex-1 flex flex-col justify-end"><div className="bg-[#0f8f86] rounded-t" style={{height:`${n/65*90}%`}}/><div className="text-[8px] text-[#718188] text-center mt-1">W{i+29}</div></div>)}</div></div></Panel><Panel title="Agent entry point"><div className="text-sm font-bold">Don't just read the surveillance stream.</div><p className="text-xs text-[#64747b] mt-2">Ask POPU to investigate a signal and let the agent coordinate anomaly detection, cross-source evidence and forecasting.</p><button onClick={()=>launch('Investigate the cholera signal in Edo State.')} className="mt-4 px-3 py-2 rounded-lg bg-[#102a33] text-white text-xs font-bold">Investigate a signal</button></Panel></div>}
function Diseases({launch}:{launch:(p:string)=>void}){return <div className="grid md:grid-cols-3 gap-5">{diseases.map(d=><Panel key={d[0]} title={d[0]}><div className="text-[10px] font-bold text-[#08766f]">{d[1]}</div><p className="text-xs text-[#64747b] mt-3">{d[2]}</p><button onClick={()=>launch(`Investigate the ${d[0]} signal in Edo State.`)} className="mt-4 text-[10px] font-bold text-[#08766f]">Investigate disease →</button></Panel>)}</div>}
function Geography({launch}:{launch:(p:string)=>void}){
 const [selectedState,setSelectedState]=React.useState('Edo State');
 const [selectedLga,setSelectedLga]=React.useState('');
 const states=NIGERIA_GEOGRAPHY.filter(g=>g.level==='State');
 const lgas=getLGAsForState(selectedState);
 const availability=getGeographyAvailability(selectedState);
 const facilityStatus=getHealthFacilityStatus(selectedLga || 'the selected LGA');
 return <div className="space-y-5">
  <Panel title="Geographic intelligence hierarchy">
   <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-5">
    {['Nigeria','State','LGA','Health Facility'].map((x,i)=><React.Fragment key={x}>
     <div className={`w-full md:w-auto px-5 py-4 rounded-xl border text-center ${i===0?'bg-[#102a33] text-white border-[#102a33]':'bg-[#eef8f7] border-[#d5eeeb]'}`}>
      <Globe2 size={16} className={`mx-auto ${i===0?'text-[#65d0c5]':'text-[#0f8f86]'}`}/>
      <div className="text-xs font-bold mt-2">{x}</div>
      <div className={`text-[9px] mt-1 ${i===0?'text-slate-300':'text-[#718188]'}`}>{i===0?'National scope':'Child geography'}</div>
     </div>{i<3&&<ChevronRight className="hidden md:block text-[#a4b3b8]"/>}
    </React.Fragment>)}
   </div>
   <div className="grid sm:grid-cols-3 gap-3 mt-3">
    <div className="p-3 rounded-xl bg-[#f8fafb] border border-[#e4ebed]"><div className="popu-label">Country</div><div className="font-black mt-1">1</div></div>
    <div className="p-3 rounded-xl bg-[#f8fafb] border border-[#e4ebed]"><div className="popu-label">States + FCT</div><div className="font-black mt-1">37</div></div>
    <div className="p-3 rounded-xl bg-[#f8fafb] border border-[#e4ebed]"><div className="popu-label">Configured LGAs</div><div className="font-black mt-1">{NIGERIA_LGAS.length}</div></div>
   </div>
   <p className="text-[10px] text-[#718188] mt-4">Administrative geography and epidemiological data availability are separate layers. POPU only displays an LGA or facility as configured when a corresponding source is available.</p>
  </Panel>

  <div className="grid xl:grid-cols-[1.4fr_.9fr] gap-5">
   <Panel title="Nigeria state & FCT catalogue">
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[520px] overflow-y-auto pr-1">
     {states.map(g=>{
      const selected=g.name===selectedState;
      const available=getGeographyAvailability(g.name).some(x=>x.available);
      return <button key={g.id} onClick={()=>{setSelectedState(g.name);setSelectedLga('')}} className={`text-left p-3 rounded-xl border transition-colors ${selected?'border-[#0f8f86] bg-[#eef8f7]':'border-[#e4ebed] bg-[#f8fafb] hover:border-[#9fd7d1]'}`}>
       <div className="flex items-center justify-between gap-2"><div className="text-xs font-bold">{g.name}</div>{selected&&<span className="text-[8px] font-black uppercase text-[#08766f]">Selected</span>}</div>
       <div className={`text-[9px] mt-1 font-semibold ${available?'text-[#08766f]':'text-[#718188]'}`}>{available?'Synthetic scenario configured':'Geography available · data source not configured'}</div>
      </button>
     })}
    </div>
   </Panel>

   <Panel title={`Selected geography · ${selectedState}`}>
    <div className="space-y-3">
     <div className="rounded-xl bg-[#102a33] text-white p-4">
      <div className="popu-label text-[#8edbd4]">State / FCT scope</div>
      <div className="text-lg font-black mt-1">{selectedState}</div>
      <div className="text-[10px] text-slate-300 mt-1">Parent: Nigeria</div>
     </div>
     <div className="space-y-2">
      {availability.map(item=><div key={item.disease} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-[#e4ebed]">
       <div><div className="text-xs font-bold">{item.disease}</div><div className="text-[9px] text-[#718188] mt-1">{item.status}</div></div>
       <span className={`text-[9px] font-bold px-2 py-1 rounded-full ${item.available?'bg-[#eef8f7] text-[#08766f]':'bg-[#f4f7f8] text-[#718188]'}`}>{item.available?'Available':'Unavailable'}</span>
      </div>)}
     </div>
     <button onClick={()=>launch(`Investigate the cholera signal in ${selectedState}.`)} className="w-full px-3 py-2.5 rounded-lg bg-[#0f8f86] text-white text-xs font-bold">Investigate this geography</button>
    </div>
   </Panel>
  </div>

  <Panel title={`LGA layer · ${selectedState}`}>
   {lgas.length ? <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
    {lgas.map(lga=>{
     const selected=lga.name===selectedLga;
     return <button key={lga.id} onClick={()=>setSelectedLga(lga.name)} className={`text-left p-3 rounded-xl border transition-colors ${selected?'border-[#0f8f86] bg-[#eef8f7]':'border-[#e4ebed] bg-[#f8fafb] hover:border-[#9fd7d1]'}`}>
      <div className="text-xs font-bold">{lga.name}</div><div className="text-[9px] mt-1 text-[#718188]">LGA registry configured</div>
     </button>
    })}
   </div> : <div className="p-4 rounded-xl bg-[#f8fafb] border border-[#e4ebed]"><div className="text-xs font-bold">LGA source not configured</div><div className="text-[10px] text-[#718188] mt-1">The state is valid in POPU's geography catalogue, but no LGA records are configured in this demonstration build.</div></div>}
  </Panel>

  <Panel title={selectedLga ? `Health facility layer · ${selectedLga}` : 'Health facility layer'}>
   <div className="p-4 rounded-xl bg-[#fff8ea] border border-[#f0dfba]">
    <div className="text-[10px] font-black tracking-wide">DATA SOURCE NOT CONFIGURED</div>
    <div className="text-xs text-[#64747b] mt-1">{facilityStatus.message}</div>
   </div>
   <div className="flex flex-wrap gap-2 mt-4">
    <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-[#eef8f7] text-[#08766f]">No fabricated facilities</span>
    <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-[#f4f7f8] text-[#64747b]">Adapter pending</span>
    {selectedState===FCT_GEOGRAPHY.name&&<span className="text-[9px] font-bold px-2 py-1 rounded-full bg-[#f4f7f8] text-[#64747b]">FCT administrative scope</span>}
   </div>
  </Panel>
 </div>
}
function DataSources(){const registry=getDataRegistrySummary();return <><Panel title="Active data registry"><div className="grid md:grid-cols-3 gap-3"><div className="p-4 rounded-xl bg-[#fff8ea] border border-[#f0dfba]"><div className="popu-label">Data mode</div><div className="font-black mt-1">SYNTHETIC DEMO</div><div className="text-[10px] text-[#64747b] mt-1">No production epidemiological feed is claimed as connected.</div></div><div className="p-4 rounded-xl bg-[#f8fafb] border border-[#e4ebed]"><div className="popu-label">Provider</div><div className="font-bold mt-1 text-sm">{registry.providerName}</div><div className="text-[10px] text-[#64747b] mt-1 font-mono">{registry.providerId}</div></div><div className="p-4 rounded-xl bg-[#f8fafb] border border-[#e4ebed]"><div className="popu-label">Production</div><div className="font-bold mt-1">Not connected</div><div className="text-[10px] text-[#64747b] mt-1">Adapter boundary ready for approved integrations.</div></div></div></Panel><Panel title="Approved data-source adapters"><div className="space-y-2">{sources.map(s=><div key={s[0]} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 rounded-xl bg-[#f8fafb] border border-[#e4ebed]"><div className="text-xs font-bold">{s[0]}</div><div className="text-[10px] text-[#64747b]">{s[1]}</div><div className="text-[10px] font-bold text-[#08766f]">{s[2]}</div><div className="text-[10px] text-[#64747b]">{s[3]}</div></div>)}</div></Panel></>;}
function Models(){return <div className="grid md:grid-cols-3 gap-5">{[['Anomaly Suite','Z-score · EWMA · CUSUM','v0.1'],['Forecast Service','Numerical epidemiological forecasting','v0.1'],['Evidence Retrieval','Approved guideline/document retrieval','v0.1']].map(m=><Panel key={m[0]} title={m[0]}><div className="text-sm font-bold">{m[1]}</div><div className="popu-mono text-[10px] text-[#64747b] mt-3">MODEL VERSION {m[2]}</div><div className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold text-[#08766f]"><CheckCircle2 size={13}/>Available for demo</div></Panel>)}</div>}
function Audit(){return <Panel title="Traceable agent runs"><div className="space-y-2">{['Intent parsing','Investigation plan','Surveillance query','Anomaly engine','Forecast engine','Evidence fusion','Human review'].map((x,i)=><div key={x} className="flex items-center gap-3 p-3 rounded-xl border border-[#e4ebed]"><div className="w-7 h-7 rounded-lg bg-[#eef8f7] flex items-center justify-center text-[#08766f]"><History size={14}/></div><div className="flex-1"><div className="text-xs font-bold">{x}</div><div className="text-[10px] text-[#718188]">run-2026-demo · synthetic</div></div><CheckCircle2 size={15} className="text-[#0f8f86]"/></div>)}</div></Panel>}
function Settings(){return <div className="grid lg:grid-cols-2 gap-5"><Panel title="Agent governance"><Setting label="Autonomous public-health actions" value="Prohibited"/><Setting label="Human review" value="Mandatory"/><Setting label="Synthetic data isolation" value="Enabled"/><Setting label="LLM as numerical forecast engine" value="Disabled"/></Panel><Panel title="Execution configuration"><Setting label="Anomaly sensitivity" value="Configurable"/><Setting label="Forecast horizon" value="7–14 days"/><Setting label="Geography" value="Nigeria → State → LGA → Facility"/><Setting label="Primary role" value="Epidemiological intelligence"/></Panel></div>}
function Setting({label,value}:{label:string;value:string}){return <div className="flex items-center justify-between py-3 border-b border-[#eef2f3] last:border-0"><span className="text-xs text-[#64747b]">{label}</span><span className="text-xs font-bold">{value}</span></div>}
function Workflow(){return <div className="space-y-2">{['Request','Plan','Tools','Validate','Anomaly','Forecast','Evidence','Interpret','Review'].map((x,i)=><div key={x} className="flex items-center gap-2 text-xs"><span className="w-5 h-5 rounded-full bg-[#eef8f7] text-[#08766f] flex items-center justify-center text-[9px] font-bold">{i+1}</span>{x}<ChevronRight size={12} className="ml-auto text-[#b2bec2]"/></div>)}</div>}
function Stat({icon:Icon,label,value,note}:{icon:any;label:string;value:string;note:string}){return <div className="popu-surface rounded-2xl p-4"><Icon size={17} className="text-[#0f8f86]"/><div className="popu-label mt-4">{label}</div><div className="text-2xl font-black mt-1">{value}</div><div className="text-[10px] text-[#718188] mt-1">{note}</div></div>}
function Panel({title,children,className='' }:{title:string;children:React.ReactNode;className?:string}){return <section className={`popu-surface rounded-2xl p-5 ${className}`}><div className="flex items-center justify-between mb-4"><h2 className="font-bold text-sm">{title}</h2><span className="w-1.5 h-1.5 rounded-full bg-[#0f8f86]"/></div>{children}</section>}
function Brief({onClose,onOpen}:{onClose:()=>void;onOpen:()=>void}){return <div className="fixed inset-0 z-50 bg-[#102027]/45 flex items-center justify-center p-5"><div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"><div className="p-5 border-b border-[#dce5e8] flex items-center justify-between"><div><div className="popu-label text-[#0f8f86]">Investigation brief</div><h2 className="text-xl font-black mt-1">POPU intelligence summary</h2></div><button onClick={onClose}><X size={20}/></button></div><div className="p-5 space-y-5"><div className="rounded-xl bg-[#fff8ea] border border-[#f0dfba] p-4"><div className="font-black text-sm">SYNTHETIC DEMONSTRATION DATA</div><div className="text-xs text-[#64747b] mt-1">This brief is for product demonstration and validation only.</div></div><div><div className="popu-label">System finding</div><p className="text-sm leading-relaxed mt-2">POPU combines surveillance observations, deterministic anomaly detection, forecast outputs and retrieved evidence into an explainable investigation context.</p></div><div className="grid sm:grid-cols-3 gap-3"><div className="p-4 rounded-xl bg-[#f8fafb] border border-[#e4ebed]"><div className="popu-label">Signal</div><div className="font-black mt-1">Elevated</div></div><div className="p-4 rounded-xl bg-[#f8fafb] border border-[#e4ebed]"><div className="popu-label">Forecast</div><div className="font-black mt-1">14 days</div></div><div className="p-4 rounded-xl bg-[#f8fafb] border border-[#e4ebed]"><div className="popu-label">Review</div><div className="font-black mt-1">Required</div></div></div><div className="rounded-xl bg-[#102a33] text-white p-4"><div className="flex gap-2 text-xs font-bold"><ShieldCheck size={15} className="text-[#65d0c5]"/>Human review required</div><p className="text-[11px] text-slate-300 mt-2">No autonomous public-health action is issued by POPU.</p></div></div><div className="p-5 border-t border-[#dce5e8] flex justify-end gap-2"><button onClick={onClose} className="px-3 py-2 border border-[#dce5e8] rounded-lg text-xs font-bold">Close</button><button onClick={onOpen} className="px-3 py-2 bg-[#0f8f86] text-white rounded-lg text-xs font-bold">Open in Agent Workspace</button></div></div></div>}
