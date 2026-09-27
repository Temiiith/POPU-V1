import React, { useEffect, useMemo, useState } from 'react';
import { Activity, AlertTriangle, BrainCircuit, CheckCircle2, Clock3, FlaskConical, Hospital, MapPinned, Play, RefreshCw, ShieldCheck, Sparkles, TrendingUp, Waves } from 'lucide-react';
import { AgentService, AgentExecutionState, INITIAL_INVESTIGATION_STEPS } from '../../services/agentService';
import { ChatMessage, AnomalyResult, EvidenceItem } from '../../types/agent';
import { ForecastChart } from './ForecastChart';
import { InvestigationTraceView } from './InvestigationTraceView';

interface Props { initialPrompt?: string; onOpenBriefGlobal?:()=>void }

const emptyState=():AgentExecutionState=>({isInvestigating:false,activeStepId:null,steps:INITIAL_INVESTIGATION_STEPS.map(s=>({...s,status:'pending'})),toolsExecuted:[],evidence:[],anomaly:null,forecast:null,riskAssessment:null,uncertainty:null,aiInterpretation:null,recommendations:[],trace:null,activeDisease:'Cholera',activeGeography:'Nigeria',dataAvailabilityStatus:'not_checked',dataAvailabilityMessage:null});
const statusIcon=(status:string)=>status==='completed'?<CheckCircle2 size={15} className="text-[#0f8f86]"/>:status==='running'?<RefreshCw size={15} className="text-[#c47a18] animate-spin"/>:<Clock3 size={15} className="text-[#9aa9ae]"/>;
const evidenceIcon=(category:string)=>category==='LABORATORY'?<FlaskConical size={15}/>:category==='HOSPITAL'?<Hospital size={15}/>:category==='ENVIRONMENT'?<Waves size={15}/>:category==='GEOGRAPHIC'?<MapPinned size={15}/>:<Activity size={15}/>;

export const AgentWorkspace:React.FC<Props>=({initialPrompt})=>{
 const [state,setState]=useState<AgentExecutionState>(emptyState());
 const [messages,setMessages]=useState<ChatMessage[]>([]);
 const [query,setQuery]=useState(initialPrompt||'');
 const [started,setStarted]=useState(false);

 const run=async(text:string)=>{
   if(!text.trim()||state.isInvestigating)return;
   setStarted(true); setQuery(text);
   setMessages(m=>[...m,{id:`u-${Date.now()}`,sender:'user',timestamp:new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),text}]);
   try {
     const result=await AgentService.executeInvestigation(text,p=>setState(prev=>({...prev,...p})));
     setMessages(m=>[...m,{id:`a-${Date.now()}`,sender:'agent',timestamp:new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),text:`Investigation run complete. ${result.activeDisease} in ${result.activeGeography} produced ${result.evidence.length} evidence items. Review the anomaly, forecast, evidence chain and uncertainty before operational action.`}]);
   } catch (error) {
     setState(prev=>({...prev,isInvestigating:false,activeStepId:null}));
     setMessages(m=>[...m,{id:`e-${Date.now()}`,sender:'agent',timestamp:new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),text:`The investigation could not be completed. ${error instanceof Error ? error.message : 'Unexpected execution error'}. No unsupported result was generated.`}]);
   }
 };
 useEffect(()=>{ if (initialPrompt && !started) setQuery(initialPrompt); },[initialPrompt,started]);

 const anomaly=state.anomaly; const forecast=state.forecast;
 const chart=useMemo(()=>anomaly?.timeSeries||[],[anomaly]);
 const max=Math.max(1,...chart.map(x=>Math.max(x.observed,x.upperThreshold||0)));
 const observedPath=chart.map((p,i)=>`${(i/(Math.max(1,chart.length-1)))*100},${100-(p.observed/max)*86}`).join(' ');
 const basePath=chart.map((p,i)=>`${(i/(Math.max(1,chart.length-1)))*100},${100-(p.baseline/max)*86}`).join(' ');
 return <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-[#f4f7f8]">
   <div className="max-w-[1500px] mx-auto p-5 lg:p-7 space-y-5">
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
      <div><div className="popu-label text-[#0f8f86]">AI Epidemiologist · Investigation workspace</div><h1 className="text-2xl lg:text-3xl font-black tracking-tight mt-1">Turn a signal into an evidence-backed investigation.</h1><p className="text-sm text-[#64747b] mt-2 max-w-3xl">POPU coordinates approved data sources, statistical engines and evidence retrieval. It does not replace surveillance systems or make autonomous public-health decisions.</p></div>
      <div className="flex items-center gap-2 text-[10px] font-bold"><span className="px-2.5 py-1.5 rounded-full bg-[#fff8ea] text-[#9a6111] border border-[#f0dfba]">SYNTHETIC DEMONSTRATION DATA</span><span className="px-2.5 py-1.5 rounded-full bg-[#eef8f7] text-[#08766f] border border-[#d5eeeb]">HUMAN REVIEW REQUIRED</span></div>
    </div>

    <section className="popu-surface rounded-2xl p-4 lg:p-5">
      <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-[#102a33] text-white flex items-center justify-center"><Sparkles size={17}/></div><div><div className="popu-label">Ask POPU</div><div className="text-sm font-bold">Natural-language epidemiological investigation</div></div></div>
      <div className="mt-4 flex gap-2"><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')void run(query)}} className="flex-1 h-11 rounded-xl border border-[#dce5e8] bg-[#f8fafb] px-4 text-sm outline-none focus:ring-2 focus:ring-[#0f8f86]/20" placeholder="e.g. Investigate the cholera signal in Edo State"/><button disabled={state.isInvestigating} onClick={()=>void run(query)} className="px-4 h-11 rounded-xl bg-[#0f8f86] text-white text-xs font-bold flex items-center gap-2 disabled:opacity-50"><Play size={14}/>{state.isInvestigating?'Investigating…':'Run investigation'}</button></div>
      {messages.length>0&&<div className="mt-3 text-xs text-[#64747b] flex items-start gap-2"><BrainCircuit size={14} className="text-[#0f8f86] mt-0.5"/><span>{messages[messages.length-1].text}</span></div>}
      {state.dataAvailabilityStatus==='unavailable'&&<div className="mt-4 rounded-xl border border-[#f0dfba] bg-[#fff8ea] p-4"><div className="flex items-start gap-3"><AlertTriangle size={17} className="text-[#c47a18] mt-0.5"/><div><div className="text-xs font-black text-[#7d5010]">DATA UNAVAILABLE</div><div className="text-xs text-[#7b684e] mt-1 leading-relaxed">{state.dataAvailabilityMessage}</div><div className="text-[10px] text-[#8d795d] mt-2">This does not mean the disease is absent. It means the current demonstration provider has no configured data for this disease + geography combination.</div></div></div></div>}
    </section>

    <section className="grid grid-cols-1 xl:grid-cols-[1.05fr_1.8fr_1fr] gap-5">
      <div className="popu-surface rounded-2xl p-5"><div className="flex items-center justify-between mb-4"><div><div className="popu-label">Agent trace</div><h2 className="font-bold mt-1">Investigation plan</h2></div><span className="popu-mono text-[10px] text-[#64747b]">{state.toolsExecuted.length}/12 tools</span></div><div className="space-y-1.5">{state.steps.map((s,i)=><div key={s.id} className={`flex gap-3 p-2.5 rounded-xl ${s.status==='running'?'bg-[#fff8ea]':s.status==='completed'?'bg-[#f4fbfa]':''}`}><div className="mt-0.5">{statusIcon(s.status)}</div><div className="min-w-0"><div className="text-xs font-semibold">{i+1}. {s.label}</div><div className="text-[10px] text-[#718188] mt-0.5 leading-relaxed">{s.description}</div></div></div>)}</div></div>

      <div className="space-y-5">
        <div className="popu-surface rounded-2xl p-5"><div className="flex justify-between items-start"><div><div className="popu-label">Intelligence result</div><h2 className="text-lg font-black mt-1">{state.dataAvailabilityStatus==='unavailable'?'Investigation unavailable':state.riskAssessment?.signalTitle||'Waiting for investigation'}</h2><div className="text-xs text-[#64747b] mt-1">{state.activeDisease} · {state.activeGeography}</div>{state.dataAvailabilityStatus==='unavailable'&&<div className="text-[10px] font-bold text-[#c47a18] mt-2">No substitute geography used</div>}</div>{state.riskAssessment&&<div className="text-right"><div className="popu-label">Status</div><div className="text-sm font-black text-[#c47a18] mt-1">{state.riskAssessment.signalStatus}</div></div>}</div>
          <div className="grid grid-cols-3 gap-3 mt-5"><Metric label="Anomaly" value={anomaly?`${anomaly.zScore>0?'+':''}${anomaly.zScore}σ`:'—'} note={anomaly?.method||'Not run'}/><Metric label="Forecast score" value={forecast?`${forecast.riskScore}/100`:'—'} note={forecast?'synthetic model score · not outbreak probability':'Not run'}/><Metric label="Evidence" value={String(state.evidence.length)} note="cross-source items"/></div>
          <div className="mt-5 rounded-xl bg-[#102a33] p-4 text-white"><div className="flex items-center gap-2 text-xs font-bold"><ShieldCheck size={15} className="text-[#65d0c5]"/>AI interpretation — review before action</div><p className="text-xs text-slate-300 mt-2 leading-relaxed">{state.aiInterpretation?.interpretation||'POPU will explain the relationship between observed signals, statistical outputs and model results after the investigation completes.'}</p></div>
        </div>
        <div className="popu-surface rounded-2xl p-5"><div className="flex items-center justify-between"><div><div className="popu-label">Observed vs baseline</div><h2 className="font-bold mt-1">Epidemiological signal</h2></div><span className="text-[10px] font-bold text-[#64747b]">{anomaly?.dataStatus||'MODEL OUTPUT PENDING'}</span></div>{chart.length?<div className="mt-4 h-44 relative"><svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full"><polyline points={basePath} fill="none" stroke="#9aa9ae" strokeWidth="1.4" strokeDasharray="3 3"/><polyline points={observedPath} fill="none" stroke="#0f8f86" strokeWidth="2.2"/></svg><div className="absolute left-0 bottom-0 text-[9px] text-[#64747b]">historical baseline</div><div className="absolute right-0 top-0 text-[9px] text-[#08766f] font-bold">observed</div></div>:<Empty label="Run the investigation to populate the statistical series."/>}</div>
      </div>

      <div className="space-y-5">
        <div className="popu-surface rounded-2xl p-5"><div className="popu-label">Evidence chain</div><h2 className="font-bold mt-1">What supports the signal?</h2><div className="mt-4 space-y-2">{state.evidence.slice(0,7).map((e:EvidenceItem)=><div key={e.id} className="p-3 rounded-xl bg-[#f8fafb] border border-[#e4ebed]"><div className="flex items-center gap-2 text-[10px] font-bold text-[#08766f]">{evidenceIcon(e.category)}{e.category} <span className="ml-auto text-[#64747b]">{e.label}</span></div><div className="text-xs font-semibold mt-1">{e.metric}: {e.value}</div><div className="text-[10px] text-[#718188] mt-1">{e.source}</div></div>)}{!state.evidence.length&&<Empty label="Evidence will appear as tools complete."/>}</div></div>
        <div className="popu-surface rounded-2xl p-5"><div className="popu-label">Uncertainty</div><div className="flex items-end gap-2 mt-1"><span className="text-2xl font-black">{state.uncertainty?`${state.uncertainty.dataCompletenessScore}%`:'—'}</span><span className="text-xs text-[#64747b] pb-1">data completeness</span></div><div className="h-2 bg-[#e8edef] rounded-full mt-3 overflow-hidden"><div className="h-full bg-[#0f8f86] rounded-full" style={{width:`${state.uncertainty?.dataCompletenessScore||0}%`}}/></div><p className="text-[10px] text-[#718188] mt-3">{state.uncertainty?.predictionIntervalDescription||'Prediction and coverage limitations will be surfaced here.'}</p></div>
      </div>
    </section>

    <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="popu-surface rounded-2xl p-5 lg:col-span-2"><div className="flex items-center justify-between"><div><div className="popu-label">Model output</div><h2 className="font-bold mt-1">14-day forecast</h2></div>{forecast&&<span className="popu-mono text-[10px] text-[#64747b]">{forecast.modelName} · {forecast.modelVersion}</span>}</div>{forecast?<><div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4"><Metric label="Forecast score" value={`${forecast.riskScore}/100`} note="synthetic model score · not outbreak probability"/><Metric label="Trend" value={forecast.trend.replace('_',' ')} note="forecast direction"/><Metric label="Weekly total" value={String(forecast.expectedWeeklyTotal)} note="expected"/><Metric label="Interval" value="95%" note="prediction interval"/></div><div className="mt-4"><ForecastChart forecast={forecast}/></div></>:<Empty label="Forecast service has not returned a model output yet."/>}</div>
      <div className="popu-surface rounded-2xl p-5"><div className="popu-label">Recommended investigation actions</div><div className="space-y-3 mt-3">{state.recommendations.slice(0,4).map(r=><div key={r.id} className="flex gap-2"><span className="w-5 h-5 shrink-0 rounded-full bg-[#eef8f7] text-[#08766f] text-[9px] font-bold flex items-center justify-center">{r.order}</span><div><div className="text-xs font-semibold">{r.action}</div><div className="text-[10px] text-[#718188] mt-0.5">{r.owner} · {r.urgency}</div></div></div>)}{!state.recommendations.length&&<Empty label="Recommendations appear after evidence fusion."/>}</div></div>
    </section>

    {state.trace&&<InvestigationTraceView trace={state.trace}/>}

    <div className="popu-surface rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-3"><div className="w-9 h-9 rounded-xl bg-[#fff8ea] text-[#c47a18] flex items-center justify-center"><AlertTriangle size={17}/></div><div className="flex-1"><div className="text-xs font-black">Human review is mandatory</div><div className="text-[10px] text-[#64747b] mt-0.5">POPU produces intelligence and recommendations for review. It does not issue autonomous public-health action orders.</div></div><div className="flex items-center gap-1.5 text-[10px] font-bold text-[#08766f]"><ShieldCheck size={14}/>Review required</div></div>
   </div>
 </div>
}
function Metric({label,value,note}:{label:string;value:string;note:string}){return <div className="rounded-xl bg-[#f8fafb] border border-[#e4ebed] p-3"><div className="popu-label">{label}</div><div className="text-lg font-black mt-1 capitalize">{value}</div><div className="text-[9px] text-[#718188] mt-0.5">{note}</div></div>}
function Empty({label}:{label:string}){return <div className="rounded-xl border border-dashed border-[#ccd8dc] bg-[#f8fafb] p-5 text-center text-xs text-[#718188]">{label}</div>}
