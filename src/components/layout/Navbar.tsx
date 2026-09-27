import React from 'react';
import { Activity, FileText, Plus, Search, ShieldCheck } from 'lucide-react';

interface Props { onNewInvestigation:()=>void; onOpenBrief:()=>void; currentView:string; onSelectView:(view:string)=>void }
export const Navbar:React.FC<Props>=({onNewInvestigation,onOpenBrief})=>(
  <header className="h-16 shrink-0 bg-white border-b border-[#dce5e8] flex items-center px-5 gap-5 z-20">
    <div className="flex items-center gap-3 min-w-[232px]">
      <div className="w-9 h-9 rounded-xl bg-[#102a33] text-white flex items-center justify-center"><Activity size={19}/></div>
      <div><div className="font-black tracking-tight text-lg leading-none">POPU</div><div className="text-[9px] uppercase tracking-[.16em] text-[#64747b] mt-1">Epidemiological Intelligence</div></div>
    </div>
    <div className="hidden md:flex flex-1 max-w-xl items-center gap-2 h-10 px-3 rounded-lg bg-[#f4f7f8] border border-[#dce5e8] text-[#64747b]">
      <Search size={16}/><span className="text-sm">Search investigations, signals, diseases...</span><span className="ml-auto text-[10px] font-mono border border-[#cbd6da] rounded px-1.5 py-0.5">/</span>
    </div>
    <div className="ml-auto flex items-center gap-2">
      <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#fff8ea] text-[#9a6111] border border-[#f0dfba] text-[10px] font-bold"><span className="w-1.5 h-1.5 rounded-full bg-[#c47a18]"/>SYNTHETIC DEMO</span>
      <span className="hidden lg:flex items-center gap-1.5 text-[10px] font-semibold text-[#08766f] px-2.5"><ShieldCheck size={14}/>Human review enabled</span>
      <button onClick={onOpenBrief} className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-[#dce5e8] bg-white text-xs font-semibold"><FileText size={15}/>Brief</button>
      <button onClick={onNewInvestigation} className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0f8f86] hover:bg-[#08766f] text-white text-xs font-bold"><Plus size={15}/>New investigation</button>
    </div>
  </header>
);
