import React, { useEffect, useState } from 'react';
import { GlobalSearch } from './components/layout/GlobalSearch';
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
import { fetchSignals, type SignalResult } from './api/signals';
import {
  PLATFORM_DISEASES,
  PLATFORM_SIGNALS,
  PLATFORM_SOURCES,
} from './data/platformSearch';

import { AnomalyChart } from './components/agent/AnomalyChart';
import { AnomalyService } from './services/anomalyService';
import { AnomalyMethod } from './types/agent';
import { ForecastChart } from './components/agent/ForecastChart';
import { fetchForecast, type ForecastResult } from './api/forecast';
import { SurveillanceService } from './services/surveillanceService';

export default function App(){
 const [view,setView]=useState('agent');
const [prompt,setPrompt]=useState('');
const [brief,setBrief]=useState(false);
const [agentKey,setAgentKey]=useState(0);
const [searchOpen,setSearchOpen]=useState(false);
const [theme,setTheme]=useState<'light' | 'dark' | 'system'>('light');
const [investigationHistory,setInvestigationHistory]=useState<import('./types/agent').InvestigationTrace[]>([]);
const launch=(p:string)=>{setPrompt(p);setView('agent');setAgentKey(k=>k+1)};
const toggleTheme = () => {
  setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
}; 
 useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (
        event.key === '/' &&
        !searchOpen &&
        (event.target as HTMLElement)?.tagName !== 'INPUT' &&
        (event.target as HTMLElement)?.tagName !== 'TEXTAREA'
      ) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handler);

    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [searchOpen]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
  }, [theme]);
  return (
    <div className="min-h-screen flex flex-col bg-[var(--popu-bg)] text-[var(--popu-text)]">
      <Navbar
        onNewInvestigation={() => launch('Investigate the latest public health signal in Nigeria')}
        onOpenBrief={() => setBrief(true)}
        onOpenSearch={() => setSearchOpen(true)}

      onOpenMobileMenu={() => {}}
      onToggleTheme={toggleTheme}
      theme={theme}
        currentView={view}
        onSelectView={setView}
      />

      <div className="flex flex-1 min-h-0">
        <Sidebar
          currentView={view}
          onSelectView={setView}
        />

        <main className="flex-1 min-w-0 overflow-y-auto">
          {view === 'agent' ? (
            <AgentWorkspace
              key={agentKey}
              initialPrompt={prompt}
              onInvestigationComplete={(trace) =>
                setInvestigationHistory((prev) => [trace, ...prev])
              }
            />
          ) : (
            <ViewRouter
              view={view}
              launch={launch}
              investigationHistory={investigationHistory}
              theme={theme}
              setTheme={setTheme}
            />
          )}
        </main>
      </div>

      <GlobalSearch
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={(nextView) => {
          setView(nextView);
          setSearchOpen(false);
        }}
        onLaunch={(nextPrompt) => {
          setSearchOpen(false);
          launch(nextPrompt);
        }}
        investigationHistory={investigationHistory}
      />

    {brief && (
  <Brief
    onClose={() => setBrief(false)}
    onOpen={() => {
      setBrief(false);
      launch('Investigate the latest public health signal in Nigeria');
    }}
  />
)}
      </div>
  );
}

function ViewRouter({view,launch,investigationHistory,theme,setTheme}:{view:string;launch:(p:string)=>void;investigationHistory:import('./types/agent').InvestigationTrace[];theme:'light' | 'dark' | 'system';setTheme:React.Dispatch<React.SetStateAction<'light' | 'dark' | 'system'>>;}){
 const titles:Record<string,string>={dashboard:'National intelligence overview',signals:'Signals',investigations:'Investigations',alerts:'Alerts',anomalies:'Anomalies',forecasts:'Forecasts',surveillance:'Surveillance',diseases:'Diseases',geography:'Geography',datasources:'Data sources',models:'Models',audit:'Audit trail',settings:'Settings'};
 return <div className="max-w-[1450px] mx-auto p-5 lg:p-7 space-y-5">
  <div><div className="popu-label text-[var(--popu-teal)]">POPU Intelligence Layer</div><h1 className="text-2xl font-black tracking-tight mt-1">{titles[view]||'Intelligence'}</h1><p className="text-sm text-[var(--popu-sub)] mt-1">Supporting intelligence surfaces for investigation not a replacement for source surveillance systems.</p></div>
  {view==='dashboard'&&<Dashboard launch={launch}/>}
{view==='signals'&&<Signals launch={launch}/>}
{view==='investigations'&&<Investigations launch={launch} investigationHistory={investigationHistory}/>}
{view==='alerts'&&<Alerts launch={launch}/>}
{view==='anomalies'&&<Anomalies launch={launch}/>}
{view==='forecasts'&&<Forecasts launch={launch}/>}
{view==='surveillance'&&<Surveillance launch={launch}/>}
{view==='diseases'&&<Diseases launch={launch}/>}
{view==='geography'&&<Geography launch={launch}/>}
{view==='datasources'&&<DataSources/>}
{view==='models'&&<Models/>}
{view==='audit'&&<Audit investigationHistory={investigationHistory}/>}
{view==='settings'&&<Settings theme={theme} setTheme={setTheme}/>}
 </div>
}
function Anomalies({launch}:{launch:(p:string)=>void}){
  const [disease, setDisease] = useState<'Cholera' | 'Dengue' | 'Lassa fever'>('Cholera');
  const [method, setMethod] = useState<AnomalyMethod>('Z-score');

  const anomaly = AnomalyService.detectAnomaly({
    disease,
    geography: 'Edo State',
    method,
  });

  return (
    <div className="space-y-5">
      <Panel title="Statistical anomaly detection">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
          <div>
            <div className="text-xs text-[var(--popu-sub)] mb-1">
              SYNTHETIC DEMONSTRATION SCENARIO
            </div>
            <h2 className="text-lg font-bold">
              Disease signal monitoring
            </h2>
            <p className="text-sm text-[var(--popu-sub)] mt-1">
              Statistical detection identifies unusual patterns for human investigation.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {PLATFORM_DISEASES.map((item) => (
              <button
                key={item.name}
                onClick={() => setDisease(item.name)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border ${
                  disease === item.name
                    ? 'bg-[var(--popu-teal)] text-white border-[var(--popu-teal)]'
                    : 'bg-[var(--popu-surface)] text-[var(--popu-sub)] border-[var(--popu-border)] hover:border-[var(--popu-teal)]'
                }`}

              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <AnomalyChart
          anomaly={anomaly}
          onMethodChange={(updated) => {
            setMethod(updated.method);
          }}
        />
      </Panel>

      <div className="grid md:grid-cols-3 gap-4">
        <Panel title="Detection">
          <div className="text-2xl font-black">
            {anomaly.status}
          </div>
          <p className="text-xs text-[var(--popu-sub)] mt-2">
            Method: {method}
          </p>
        </Panel>

        <Panel title="Observed">
          <div className="text-2xl font-black">
            {anomaly.observedValue}
          </div>
          <p className="text-xs text-[var(--popu-sub)] mt-2">
            cases per week
          </p>
        </Panel>

        <Panel title="Baseline deviation">
          <div className="text-2xl font-black">
            {anomaly.deviationPercent}%
          </div>
          <p className="text-xs text-[var(--popu-sub)] mt-2">
            Expected baseline: {anomaly.expectedBaseline}
          </p>
        </Panel>
      </div>

      <Panel title="Investigation">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="font-semibold">
              {disease} Edo State
            </div>
            <p className="text-sm text-[var(--popu-sub)] mt-1">
              An anomaly is a signal for investigation, not a confirmed outbreak.
            </p>
          </div>
          <button
            onClick={() =>
              launch(`Investigate the ${disease.toLowerCase()} signal in Edo State.`)
            }
            className="px-4 py-2.5 rounded-lg border border-[var(--popu-teal)] bg-[var(--popu-teal)] text-[var(--popu-bg)] text-sm font-semibold transition-colors hover:bg-[var(--popu-teal-dark)] hover:border-[var(--popu-teal-dark)]"
 >
 Investigate signal
 </button>
        </div>
      </Panel>
    </div>
  );
}
function Forecasts({launch}:{launch:(p:string)=>void}){
  const [disease, setDisease] = useState<'Cholera' | 'Dengue' | 'Lassa fever'>('Cholera');
  const [horizon, setHorizon] = useState(14);
  const [forecast, setForecast] = useState<ForecastResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError('');
    setForecast(null);

    fetchForecast(
      disease.toLowerCase() === 'lassa fever'
        ? 'lassa_fever'
        : disease.toLowerCase(),
      'Edo State',
      horizon,
    )
      .then((result) => {
        if (!cancelled) {
          setForecast(result);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load forecast.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [disease, horizon]);

  return (
    <div className="space-y-5">
      <Panel title="Epidemiological forecasting">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-5">
          <div>
            <div className="text-xs text-[var(--popu-sub)] mb-1">
              SYNTHETIC MODEL OUTPUT
            </div>

            <h2 className="text-lg font-bold">
              Disease risk projection
            </h2>

            <p className="text-sm text-[var(--popu-sub)] mt-1">
              Numerical forecast generated by the POPU forecasting service.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {PLATFORM_DISEASES.map((item) => (
              <button
                key={item.name}
                onClick={() => setDisease(item.name)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border ${
                  disease === item.name
                    ? 'bg-[var(--popu-teal)] text-white border-[var(--popu-teal)]'
                    : 'bg-[var(--popu-surface)] text-[var(--popu-sub)] border-[var(--popu-border)] hover:border-[var(--popu-teal)]'
                }`}
              >
                {item.name}
              </button>
            ))}

            {[7, 14, 30].map((days) => (
              <button
                key={days}
                onClick={() => setHorizon(days)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border ${
                  horizon === days
                    ? 'bg-[var(--popu-navy)] text-white border-[var(--popu-navy)]'
                    : 'bg-[var(--popu-surface)] text-[var(--popu-sub)] border-[var(--popu-border)]'
                }`}
              >
                {days} days
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="popu-surface border border-[var(--popu-border)] rounded-2xl p-6">
            <div className="text-sm font-semibold text-[var(--popu-text)]">
              Loading forecast...
            </div>
            <div className="text-xs text-[var(--popu-sub)] mt-2">
              Requesting the numerical forecast from the POPU backend.
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="bg-rose-950/20 border border-rose-800/60 rounded-2xl p-5">
            <div className="text-sm font-semibold text-red-800">
              Forecast unavailable
            </div>
            <div className="text-xs text-rose-300 mt-2">
              {error}
            </div>
          </div>
        )}

        {!loading && !error && forecast && (
          <ForecastChart forecast={forecast} />
        )}
      </Panel>

      {!loading && !error && forecast && (
        <>
          <div className="grid md:grid-cols-4 gap-4">
            <Panel title="Risk score">
              <div className="text-2xl font-black">
                {forecast.risk_score}
              </div>
              <p className="text-xs text-[var(--popu-sub)] mt-2">
                Backend model score / 100
              </p>
            </Panel>

            <Panel title="Risk level">
              <div className="text-lg font-black">
                {forecast.risk_level}
              </div>
              <p className="text-xs text-[var(--popu-sub)] mt-2">
                Forecast risk classification
              </p>
            </Panel>

            <Panel title="Forecast horizon">
              <div className="text-2xl font-black">
                {forecast.forecast_horizon_days}
              </div>
              <p className="text-xs text-[var(--popu-sub)] mt-2">
                Days projected
              </p>
            </Panel>

            <Panel title="Model">
              <div className="text-sm font-bold">
                {forecast.model}
              </div>
              <p className="text-xs text-[var(--popu-sub)] mt-2">
                Version {forecast.model_version}
              </p>
            </Panel>
          </div>

          <Panel title="Interpretation">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="font-semibold">
                  {disease} Edo State
                </div>

                <p className="text-sm text-[var(--popu-sub)] mt-1 max-w-3xl">
                  Forecast outputs support investigation and planning.
                  They are model outputs based on the active synthetic
                  demonstration scenario and do not confirm an outbreak
                  or represent a validated probability of future cases.
                </p>

                {forecast.human_review_required && (
                  <div className="text-xs font-semibold text-[var(--popu-warning)] mt-3">
                    Human review required before operational use.
                  </div>
                )}
              </div>

              <button
                onClick={() =>
                  launch(
                    `Investigate the ${disease.toLowerCase()} signal in Edo State.`,
                  )
                }
                className="px-4 py-2 rounded-lg border border-[var(--popu-teal)] bg-[var(--popu-teal)] text-[var(--popu-bg)] text-sm font-semibold transition-colors hover:bg-[var(--popu-teal-dark)] hover:border-[var(--popu-teal-dark)]"
              >
                Investigate signal
              </button>
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}
function Surveillance({launch}:{launch:(p:string)=>void}){
  const [disease,setDisease]=useState<'Cholera'|'Dengue'|'Lassa fever'>('Cholera');
  const [loading,setLoading]=useState(true);
  const [cases,setCases]=useState<any>(null);
  const [trends,setTrends]=useState<any>(null);

  useEffect(()=>{
    let active=true;

    const load=async()=>{
      setLoading(true);

      const [caseData,trendData]=await Promise.all([
        SurveillanceService.getDiseaseCases(disease,'Edo State'),
        SurveillanceService.getDiseaseTrends(disease,'Edo State'),
      ]);

      if(active){
        setCases(caseData);
        setTrends(trendData);
        setLoading(false);
      }
    };

    load();

    return()=>{
      active=false;
    };
  },[disease]);

  const unavailable=
    !cases ||
    cases.dataStatus==='DATA UNAVAILABLE FOR THIS SYNTHETIC SCENARIO';

  return(
    <div className="space-y-5">

      <Panel title="Surveillance overview">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">

          <div>
            <div className="text-xs text-[var(--popu-sub)] mb-1">
              SYNTHETIC SURVEILLANCE DATA
            </div>

            <h2 className="text-lg font-bold">
              Disease surveillance observations
            </h2>

            <p className="text-sm text-[var(--popu-sub)] mt-1">
              Observed epidemiological signals available to the POPU
              intelligence layer.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {PLATFORM_DISEASES.map((item)=>(
              <button
                key={item.name}
                onClick={()=>setDisease(item.name)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border ${
                  disease===item.name
                    ? 'bg-[var(--popu-teal)] text-white border-[var(--popu-teal)]'
                    : 'bg-[var(--popu-surface)] text-[var(--popu-sub)] border-[var(--popu-border)] hover:border-[var(--popu-teal)]'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

        </div>
      </Panel>

      {loading ? (
        <Panel title="Loading surveillance">
          <div className="py-10 text-center text-sm text-[var(--popu-sub)]">
            Retrieving surveillance observations...
          </div>
        </Panel>
      ) : unavailable ? (
        <Panel title="Surveillance data unavailable">
          <div className="rounded-xl bg-[var(--popu-muted)] border border-[var(--popu-border)] p-5">
            <div className="font-bold text-sm">
              No surveillance scenario is configured
            </div>

            <p className="text-sm text-[var(--popu-sub)] mt-2">
              No synthetic epidemiological data is currently available for
              {` ${disease} in Edo State`}.
            </p>

            <div className="text-[11px] text-[var(--popu-warning)] mt-3">
              POPU does not substitute data from another disease or geography.
            </div>
          </div>
        </Panel>
      ) : (
        <>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">

            <Panel title="Latest week">
              <div className="text-2xl font-black">
                {cases.latestWeekCount ?? ''}
              </div>
              <p className="text-xs text-[var(--popu-sub)] mt-2">
                Observed cases
              </p>
            </Panel>

            <Panel title="Observed period">
              <div className="text-2xl font-black">
                {cases.totalObservedInPeriod ?? ''}
              </div>
              <p className="text-xs text-[var(--popu-sub)] mt-2">
                Total observed cases
              </p>
            </Panel>

            <Panel title="Reporting completeness">
              <div className="text-lg font-black">
                {cases.reportingCompleteness ?? ''}
              </div>
              <p className="text-xs text-[var(--popu-sub)] mt-2">
                Synthetic scenario
              </p>
            </Panel>

            <Panel title="Trend velocity">
              <div className="text-lg font-black">
                {trends?.trendVelocity ?? ''}
              </div>
              <p className="text-xs text-[var(--popu-sub)] mt-2">
                Recent week-on-week change
              </p>
            </Panel>

          </div>

          <Panel title="Surveillance context">
            <div className="grid md:grid-cols-2 gap-4">

              <div className="rounded-xl bg-[var(--popu-muted)] border border-[var(--popu-border)] p-4">
                <div className="popu-label">
                  Disease
                </div>

                <div className="font-bold mt-1">
                  {disease}
                </div>

                <div className="text-xs text-[var(--popu-sub)] mt-1">
                  Edo State
                </div>
              </div>

              <div className="rounded-xl bg-[var(--popu-muted)] border border-[var(--popu-border)] p-4">
                <div className="popu-label">
                  Data status
                </div>

                <div className="font-bold mt-1">
                  Synthetic demonstration data
                </div>

                <div className="text-xs text-[var(--popu-sub)] mt-1">
                  Not for official public-health action
                </div>
              </div>

            </div>
          </Panel>

          <Panel title="Next intelligence step">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

              <div>
                <div className="font-semibold">
                  Investigate the {disease.toLowerCase()} signal
                </div>

                <p className="text-sm text-[var(--popu-sub)] mt-1">
                  Combine surveillance observations with anomaly, laboratory,
                  environmental and forecast evidence.
                </p>
              </div>

              <button
                onClick={()=>launch(
                  `Investigate the ${disease.toLowerCase()} signal in Edo State.`
                )}
                className=
"
px-4 py-2.5 rounded-lg border border-[var(--popu-teal)] bg-[var(--popu-teal)] text-[var(--popu-bg)] text-sm font-semibold transition-colors hover:bg-[var(--popu-teal-dark)] hover:border-[var(--popu-teal-dark)]
"
              >
                Investigate signal
              </button>

            </div>
          </Panel>
        </>
      )}

    </div>
  );
}
function Diseases({launch}:{launch:(p:string)=>void}){
  return (
    <div className="space-y-5">

      <Panel title="Disease intelligence registry">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="text-xs text-[var(--popu-sub)] mb-1">
              MONITORED DISEASES
            </div>

            <h2 className="text-lg font-bold">
              Epidemiological disease coverage
            </h2>

            <p className="text-sm text-[var(--popu-sub)] mt-1">
              Diseases currently configured in the POPU demonstration
              intelligence layer.
            </p>
          </div>

          <div className="rounded-lg bg-[var(--popu-muted)] border border-[var(--popu-border)] px-3 py-2">
            <div className="text-[10px] font-black text-[var(--popu-warning)]">
              SYNTHETIC DEMONSTRATION
            </div>

            <div className="text-[11px] text-[var(--popu-sub)] mt-0.5">
              Not for official public-health action
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid md:grid-cols-3 gap-4">
        {PLATFORM_DISEASES.map((disease) => (
          <Panel key={disease.name} title={disease.name}>

            <div className="rounded-xl bg-[var(--popu-muted)] border border-[var(--popu-border)] p-4">
              <div className="popu-label">
                Classification
              </div>

              <div className="font-bold text-sm mt-1">
                {disease.category}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wide font-bold text-[var(--popu-sub)]">
                  Intelligence status
                </div>

                <div className="text-sm font-bold mt-1">
                  Monitored
                </div>
              </div>

              <div className="w-2.5 h-2.5 rounded-full bg-[var(--popu-teal)]" />
            </div>

            <button
              onClick={() =>
                launch(
                  `Investigate the ${disease.name.toLowerCase()} signal in Edo State.`
                )
              }
              className="w-full mt-4 px-4 py-2.5 rounded-lg border border-[var(--popu-teal)] bg-[var(--popu-teal)] text-[var(--popu-bg)] text-xs font-semibold transition-colors hover:bg-[var(--popu-teal-dark)] hover:border-[var(--popu-teal-dark)]"
            >
              Investigate signal
            </button>

          </Panel>
        ))}
      </div>

      <Panel title="Current disease signals">
        <div className="space-y-3">

          {PLATFORM_SIGNALS.map((signal) => (
            <div
              key={signal.id}
              className="rounded-xl border border-[var(--popu-border)] bg-[var(--popu-muted)] p-4"
            >

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">

                <div>
                  <div className="text-[10px] font-bold text-[var(--popu-teal)]">
                    {signal.id}
                  </div>

                  <div className="font-bold text-sm mt-1">
                    {signal.disease}
                  </div>

                  <div className="text-xs text-[var(--popu-sub)] mt-1">
                    {signal.geo} {signal.source}
                  </div>
                </div>

                <div className="flex items-center gap-3">

                  <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-[var(--popu-surface)] border border-[var(--popu-border)]">
                    {signal.level}
                  </span>

                  <button
                    onClick={() =>
                      launch(
                        `Investigate the ${signal.disease.toLowerCase()} signal in ${signal.geo}.`
                      )
                    }
                    className="px-3 py-2 rounded-lg bg-[var(--popu-teal)] text-white text-xs font-semibold"
                  >
                    Investigate
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
      </Panel>

    </div>
  );
}
function Geography({launch}:{launch:(p:string)=>void}){
  return (
    <div className="space-y-5">

      <Panel title="Geographic intelligence">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="text-xs text-[var(--popu-sub)] mb-1">
              NIGERIA COVERAGE
            </div>

            <h2 className="text-lg font-bold">
              Epidemiological geography
            </h2>

            <p className="text-sm text-[var(--popu-sub)] mt-1">
              Explore disease intelligence across national, state, LGA,
              and facility levels.
            </p>
          </div>

          <div className="rounded-lg bg-[var(--popu-muted)] border border-[var(--popu-border)] px-3 py-2">
            <div className="text-[10px] font-black text-[var(--popu-warning)]">
              SYNTHETIC DEMONSTRATION
            </div>

            <div className="text-[11px] text-[var(--popu-sub)] mt-0.5">
              Geographic intelligence is not for official action
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid md:grid-cols-3 gap-4">

        <Panel title="National">
          <div className="text-2xl font-black">
            Nigeria
          </div>

          <div className="text-xs text-[var(--popu-sub)] mt-1">
            National intelligence coverage
          </div>

          <button
            onClick={() =>
              launch("Investigate the current epidemiological signals in Nigeria.")
            }
            className="w-full mt-4 px-4 py-2.5 rounded-lg bg-[var(--popu-navy)] text-white text-xs font-semibold"
          >
            Investigate national signals
          </button>
        </Panel>

        <Panel title="State">
          <div className="text-2xl font-black">
            Edo State
          </div>

          <div className="text-xs text-[var(--popu-sub)] mt-1">
            Active demonstration geography
          </div>

          <button
            onClick={() =>
              launch("Investigate the cholera signal in Edo State.")
            }
            className="w-full mt-4 px-4 py-2.5 rounded-lg bg-[var(--popu-teal)] text-white text-xs font-semibold"
          >
            Investigate Edo signals
          </button>
        </Panel>

        <Panel title="LGA">
          <div className="text-2xl font-black">
            LGA intelligence
          </div>

          <div className="text-xs text-[var(--popu-sub)] mt-1">
            Drill-down available as data is configured
          </div>

          <button
            onClick={() =>
              launch("Show the epidemiological signals by LGA in Edo State.")
            }
            className="w-full mt-4 px-4 py-2.5 rounded-lg bg-[var(--popu-navy)] text-white text-xs font-semibold"
          >
            Explore LGA signals
          </button>
        </Panel>

      </div>

      <Panel title="Geographic hierarchy">
        <div className="grid md:grid-cols-4 gap-3">

          {[
            ["01", "Nigeria", "National"],
            ["02", "Edo State", "State"],
            ["03", "LGA", "Local government"],
            ["04", "Facility", "Health facility"],
          ].map(([number, name, description]) => (
            <div
              key={number}
              className="rounded-xl border border-[var(--popu-border)] bg-[var(--popu-muted)] p-4"
            >
              <div className="text-[10px] font-black text-[var(--popu-teal)]">
                {number}
              </div>

              <div className="font-bold text-sm mt-2">
                {name}
              </div>

              <div className="text-xs text-[var(--popu-sub)] mt-1">
                {description}
              </div>
            </div>
          ))}

        </div>
      </Panel>

      <Panel title="Current geographic signals">
        <div className="space-y-3">

          {PLATFORM_SIGNALS.map((signal) => (
            <div
              key={signal.id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl border border-[var(--popu-border)] bg-[var(--popu-muted)] p-4"
            >
              <div>
                <div className="text-[10px] font-bold text-[var(--popu-teal)]">
                  {signal.id}
                </div>

                <div className="font-bold text-sm mt-1">
                  {signal.disease} {signal.geo}
                </div>

                <div className="text-xs text-[var(--popu-sub)] mt-1">
                  {signal.source}
                </div>
              </div>

              <button
                onClick={() =>
                  launch(
                    `Investigate the ${signal.disease.toLowerCase()} signal in ${signal.geo}.`
                  )
                }
                className="px-3 py-2 rounded-lg bg-[var(--popu-teal)] text-white text-xs font-semibold"
              >
                Investigate
              </button>
            </div>
          ))}

        </div>
      </Panel>

    </div>
  );
}
function Dashboard({launch}:{launch:(p:string)=>void}){
  const [signals,setSignals]=useState<SignalResult[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    let mounted=true;

    async function loadDashboardSignals(){
      try{
        const data=await fetchSignals();
        if(mounted){
          setSignals(data);
        }
      }finally{
        if(mounted){
          setLoading(false);
        }
      }
    }

    loadDashboardSignals();

    return()=>{
      mounted=false;
    };
  },[]);

  const reviewCount=signals.filter(
    signal=>signal.human_review_required
  ).length;

  const anomalyCount=signals.filter(
    signal=>signal.status==="ANOMALY"
  ).length;

  const forecastCount=signals.filter(
    signal=>signal.forecast_risk_level!=="LOW"
  ).length;

  return <>
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <Stat
        icon={Activity}
        label="Signals requiring review"
        value={loading ? "" : String(reviewCount)}
        note="Across monitored demo feeds"
      />

      <Stat
        icon={AlertTriangle}
        label="Anomalies"
        value={loading ? "" : String(anomalyCount)}
        note="Statistical detection outputs"
      />

     <Stat
  icon={TrendingUp}
  label="Forecasts"
  value={loading ? "" : String(forecastCount)}
  note="Elevated forecast outputs"
/>

      <Stat
        icon={Database}
        label="Source health"
        value="5/6"
        note="One adapter pending"
      />
    </div>

    <div className="grid lg:grid-cols-3 gap-5">
      <Panel title="Current intelligence signals" className="lg:col-span-2">
        <SignalsTable launch={launch}/>
      </Panel>

      <Panel title="Agent workflow">
        <Workflow/>
      </Panel>
    </div>

    <Panel title="POPU operating principle">
      <div className="grid md:grid-cols-4 gap-3">
        {['Observe','Detect','Investigate','Explain'].map((x,i)=>
          <div
            key={x}
            className="p-4 rounded-xl bg-[var(--popu-muted)] border border-[var(--popu-border)]"
          >
            <div className="text-[10px] font-bold text-[var(--popu-teal)]">
              0{i+1}
            </div>

            <div className="font-bold text-sm mt-2">
              {x}
            </div>

            <div className="text-[10px] text-[var(--popu-sub)] mt-1">
              {[
                'Ingest approved signals.',
                'Run statistical detection.',
                'Coordinate multi-source checks.',
                'Present evidence and uncertainty.'
              ][i]}
            </div>
          </div>
        )}
      </div>
    </Panel>
  </>;
}
function Alerts({ launch }: { launch: (p: string) => void }) {
  const [signals, setSignals] = useState<SignalResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSignals()
      .then(setSignals)
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : 'Unable to load alerts.',
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  const alerts = signals.filter((signal) => signal.risk_level !== 'LOW');

  if (loading) {
    return (
      <Panel title="Active alerts">
        <div className="p-6 text-sm text-[var(--popu-sub)]">
          Loading current intelligence alerts...
        </div>
      </Panel>
    );
  }

  if (error) {
    return (
      <Panel title="Active alerts">
        <div className="p-6">
          <div className="text-sm font-semibold text-rose-300">
            Unable to load alerts
          </div>
          <div className="text-xs text-[var(--popu-sub)] mt-2">
            {error}
          </div>
        </div>
      </Panel>
    );
  }

  return (
    <div className="space-y-5">
      <Panel title="Active intelligence alerts">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-sm text-[var(--popu-sub)]">
              Signals requiring epidemiological review based on current
              surveillance, evidence, and forecast outputs.
            </p>
          </div>

          <div className="shrink-0 rounded-full border border-[var(--popu-warning)]/30 bg-[var(--popu-warning)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--popu-warning)]">
            {alerts.length} requiring attention
          </div>
        </div>

        <div className="rounded-xl border border-[var(--popu-warning)]/30 bg-[var(--popu-warning)]/10 p-4 mb-5">
          <div className="text-xs font-bold uppercase tracking-wide text-[var(--popu-warning)]">
            Human review required
          </div>
          <p className="text-xs text-[var(--popu-sub)] mt-1">
            These are intelligence signals, not confirmed outbreaks or
            clinical diagnoses. Review the underlying evidence before taking
            action.
          </p>
        </div>

        {alerts.length === 0 ? (
          <div className="rounded-xl border border-[var(--popu-border)] bg-[var(--popu-muted)] p-6">
            <div className="text-sm font-semibold text-[var(--popu-text)]">
              No active alerts
            </div>
            <p className="text-xs text-[var(--popu-sub)] mt-2">
              No current signal has an elevated or moderate integrated risk
              level.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((signal) => {
              const isHigh = signal.risk_level === 'ELEVATED';

              return (
                <div
                  key={signal.signal_id}
                  className="rounded-xl border border-[var(--popu-border)] bg-[var(--popu-surface)] p-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            isHigh
                              ? 'bg-rose-950/20 text-rose-300 border border-rose-800/60'
                              : 'bg-[var(--popu-warning)]/10 text-[var(--popu-warning)] border border-[var(--popu-warning)]/30'
                          }`}
                        >
                          {signal.risk_level}
                        </span>

                        <span className="text-[11px] font-mono text-[var(--popu-sub)]">
                          {signal.signal_id}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[var(--popu-text)] mt-2">
                        {signal.disease} {signal.geography}
                      </h3>

                      <p className="text-sm text-[var(--popu-sub)] mt-1">
                        {signal.summary}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        launch(
                          `Investigate the ${signal.disease} signal in ${signal.geography}.`,
                        )
                      }
                      className="shrink-0 rounded-lg bg-[var(--popu-teal)] px-4 py-2 text-xs font-bold text-white hover:bg-[var(--popu-teal-dark)]"
                    >
                      Investigate
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
                    <div className="rounded-xl bg-[var(--popu-muted)] border border-[var(--popu-border)] p-3">
                      <div className="popu-label">
                        Observed
                      </div>
                      <div className="text-lg font-bold text-[var(--popu-text)] mt-1">
                        {signal.observed_value}
                      </div>
                    </div>

                    <div className="rounded-xl bg-[var(--popu-muted)] border border-[var(--popu-border)] p-3">
                      <div className="popu-label">
                        Deviation
                      </div>
                      <div className="text-lg font-bold text-[var(--popu-text)] mt-1">
                        {signal.percent_deviation.toFixed(1)}%
                      </div>
                    </div>

                    <div className="rounded-xl bg-[var(--popu-muted)] border border-[var(--popu-border)] p-3">
                      <div className="popu-label">
                        Integrated risk
                      </div>
                      <div className="text-lg font-bold text-[var(--popu-text)] mt-1">
                        {signal.risk_score.toFixed(0)}
                      </div>
                    </div>

                    <div className="rounded-xl bg-[var(--popu-muted)] border border-[var(--popu-border)] p-3">
                      <div className="popu-label">
                        Forecast
                      </div>
                      <div className="text-sm font-bold text-[var(--popu-text)] mt-2">
                        {signal.forecast_risk_level}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-[11px] text-[var(--popu-sub)]">
                    <span>
                      Evidence sources: {signal.supporting_sources.length}
                    </span>
                    <span>
                      Geographic signals: {signal.geographic_signal_count}
                    </span>
                    <span>
                      Forecast: {signal.forecast_direction.toLowerCase()}
                    </span>
                    <span>
                      Horizon: {signal.forecast_horizon_days} days
                    </span>
                  </div>

                  <div className="mt-4 rounded-xl border border-[var(--popu-border)] bg-[var(--popu-muted)] px-3 py-2 text-[11px] text-[var(--popu-sub)]">
                    <strong className="text-[var(--popu-text)]">
                      {signal.data_status}
                    </strong>{' '}
                    {signal.notice}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>
    </div>
  );
}
     function Signals({launch}:{launch:(p:string)=>void}){
  return (
    <Panel title="Detected signals">
      <SignalsTable launch={launch}/>
    </Panel>
  );
}

function SignalsTable({
  launch,
}: {
  launch: (p: string) => void;
}) {
  const [signals, setSignals] = useState<SignalResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadSignals() {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchSignals();

        if (mounted) {
          setSignals(data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load epidemiological signals.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadSignals();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="py-10 text-center text-xs text-[var(--popu-sub)]">
        Loading epidemiological signals...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center">
        <div className="text-xs font-semibold text-[var(--popu-danger)]">
          Unable to load signals
        </div>

        <div className="text-[10px] text-[var(--popu-sub)] mt-1">
          {error}
        </div>
      </div>
    );
  }

  if (signals.length === 0) {
    return (
      <div className="py-10 text-center text-xs text-[var(--popu-sub)]">
        No active epidemiological signals detected.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left table-fixed">
        <thead>
         <tr className="popu-label border-b border-[var(--popu-border)]">
  <th className="py-3 w-[22%]">Signal</th>
  <th className="w-[12%]">Disease</th>
  <th className="w-[16%]">Geography</th>
  <th className="w-[13%]">Status</th>
  <th className="w-[27%]">Evidence</th>
  <th className="w-[10%]" />
</tr>
        </thead>

        <tbody>
          {signals.map((signal) => {
            const tone =
              signal.status === "ANOMALY"
                ? "red"
                : "amber";

            return (
              <tr
                key={signal.signal_id}
                className="border-b border-[var(--popu-border)] last:border-0"
              >
                <td className="py-4">
                  <div className="font-mono text-[10px] text-[var(--popu-sub)]">
                    {signal.signal_id}
                  </div>

                  <div className="text-xs font-bold mt-1">
                    {new Date(signal.detected_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </td>

                <td className="text-xs font-semibold">
                  {signal.disease}
                </td>

                <td className="text-xs">
                  {signal.geography}
                </td>

                <td>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      tone === "red"
                        ? "bg-[var(--popu-muted)] text-[var(--popu-danger)]"
                        : "bg-[var(--popu-muted)] text-[var(--popu-warning)]"
                    }`}
                  >
                    {signal.status}
                  </span>
                </td>

               <td className="text-[10px] text-[var(--popu-sub)]">
  <div>
    {signal.supporting_sources.length} sources {" "}
    {signal.geographic_signal_count} geographic
  </div>
  <div className="mt-1 font-semibold">
    Risk: {signal.risk_level} ({signal.risk_score})
  </div>
  <div className="mt-1">
    Forecast: {signal.forecast_risk_level} {" "}
    {signal.forecast_direction.toLowerCase()}
  </div>
</td>

                <td>
                  <button
                    onClick={() =>
                      launch(
                        `Investigate the ${signal.disease} signal in ${signal.geography}.`,
                      )
                    }
                    className="text-[10px] font-bold text-[var(--popu-teal-dark)] flex items-center gap-1"
                  >
                    Investigate
                    <ChevronRight size={13} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}function Investigations({
  launch,
  investigationHistory,
}: {
  launch: (p: string) => void;
  investigationHistory: import('./types/agent').InvestigationTrace[];
}) { 
 const [expandedInvestigation, setExpandedInvestigation] = useState<string | null>(
    null,
  );
  const demoInvestigations = [
    {
      id: 'INV-2026-NGA-0924',
      title: 'Cholera signal investigation',
      description: 'Edo State Evidence fusion in progress',
      prompt: 'Investigate the cholera signal in Edo State.',
    },
    {
      id: 'INV-2026-NGA-0918',
      title: 'Lassa fever syndromic signal',
      description: 'Edo State Awaiting laboratory verification',
      prompt: 'Investigate the Lassa fever signal in Edo State.',
    },
    {
      id: 'INV-2026-NGA-0907',
      title: 'Dengue geographic review',
      description: 'Lagos State - Baseline monitoring',
      prompt: 'Investigate the dengue signal in Lagos State.',
    },
  ];


  return (
    <div className="space-y-5">
      {investigationHistory.length > 0 && (
        <Panel title="Session investigations">
          <div className="space-y-3">
            {investigationHistory.map((trace) => (
              <div
                key={trace.investigationId}
                className="border border-[var(--popu-border)] rounded-lg p-4"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="text-sm font-bold">
                      {trace.intentIdentified.replace(
                        'Backend investigation: ',
                        '',
                      )}
                    </div>

                    <div className="text-xs text-[var(--popu-sub)] mt-1">
                      {trace.riskLevel} risk - {trace.riskScore}/100 -{' '}
                      {trace.evidenceItemsCount} evidence items
                    </div>

                    <div className="text-[10px] text-[var(--popu-sub)] mt-2 font-mono">
                      {trace.investigationId}
                    </div>

                    <div className="text-[10px] text-[var(--popu-sub)] mt-1">
                      {new Date(trace.timestamp).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0 md:justify-end">
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[var(--popu-muted)] text-[var(--popu-warning)]">
                      {trace.humanReviewStatus}
                    </span>

                    <button
                      onClick={() =>
                        setExpandedInvestigation((current) =>
                          current === trace.investigationId
                            ? null
                            : trace.investigationId,
                        )
                      }
                      className="px-3 py-2 rounded-lg border border-[var(--popu-border)] text-xs font-bold whitespace-nowrap"
                    >
                      {expandedInvestigation === trace.investigationId
                        ? 'Hide trace'
                        : 'View trace'}
                    </button>

                    <button
                      onClick={() => launch(trace.userRequest)}
                      className="px-3 py-2 rounded-lg border border-[var(--popu-border)] text-xs font-bold whitespace-nowrap"
                    >
                      Run again in agent
                    </button>
                  </div>
                </div>

                {expandedInvestigation === trace.investigationId && (
                  <div className="mt-4 border-t border-[var(--popu-border)] pt-4 space-y-3">
                    <div className="text-xs font-bold">
                      Investigation trace
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-[var(--popu-sub)]">
                          Agent run
                        </div>
                        <div className="text-xs font-mono mt-1">
                          {trace.agentRunId}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] uppercase font-bold text-[var(--popu-sub)]">
                          Intent
                        </div>
                        <div className="text-xs mt-1">
                          {trace.intentIdentified}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] uppercase font-bold text-[var(--popu-sub)]">
                          Anomaly engine
                        </div>
                        <div className="text-xs mt-1">
                          {trace.anomalyEngine}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] uppercase font-bold text-[var(--popu-sub)]">
                          Forecast engine
                        </div>
                        <div className="text-xs mt-1">
                          {trace.forecastEngine}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] uppercase font-bold text-[var(--popu-sub)]">
                          Evidence items
                        </div>
                        <div className="text-xs mt-1">
                          {trace.evidenceItemsCount}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] uppercase font-bold text-[var(--popu-sub)]">
                          AI interpretation hash
                        </div>
                        <div className="text-xs font-mono mt-1 break-all">
                          {trace.aiInterpretationHash}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-bold text-[var(--popu-sub)]">
                        Data sources queried
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {trace.dataSourcesQueried.map((source) => (
                          <span
                            key={source}
                            className="text-[10px] px-2 py-1 rounded-full bg-[var(--popu-muted)] border border-[var(--popu-border)] whitespace-nowrap"
                          >
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-bold text-[var(--popu-sub)]">
                        Tools executed
                      </div>

                      <div className="space-y-2 mt-2">
                        {trace.toolCallsExecuted.map((tool) => (
                          <div
                            key={tool.id}
                            className="border border-[var(--popu-border)] rounded-md px-3 py-2"
                          >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-xs font-bold font-mono">
                                  {tool.name}
                                </span>

                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--popu-muted)] text-[var(--popu-teal)]">
                                  {tool.status}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-[10px] text-[var(--popu-sub)] shrink-0">
                                <span>{tool.dataSource}</span>
                                <span>/</span>
                                <span>{tool.executionTimeMs > 0 ? `${tool.executionTimeMs} ms` : 'Backend execution'}</span>
                              </div>
                            </div>

                            <div className="text-[11px] text-[var(--popu-sub)] mt-1">
                              {tool.description}
                            </div>

                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="text-[9px] px-2 py-1 rounded-full bg-[var(--popu-muted)] border border-[var(--popu-border)]">
                                {tool.dataStatus === 'synthetic'
                                  ? 'Synthetic data'
                                  : 'Production pending'}
                              </span>

                              {tool.errorState && (
                                <span className="text-[9px] px-2 py-1 rounded-full bg-[var(--popu-muted)] text-[var(--popu-danger)] border border-[var(--popu-border)]">
                                  {tool.errorState}
                                </span>
                              )}
                            </div>

                            {tool.outputs && Object.keys(tool.outputs).length > 0 && (
                              <details className="mt-2">
                                <summary className="cursor-pointer text-[10px] font-bold text-[var(--popu-teal)]">
                                  View output
                                </summary>

                                <pre className="mt-2 text-[9px] leading-relaxed bg-[var(--popu-muted)] border border-[var(--popu-border)] rounded-md p-2 overflow-x-auto whitespace-pre-wrap">
                                  {JSON.stringify(tool.outputs, null, 2)}
                                </pre>
                              </details>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Panel>
      )}
      
      <Panel title="Investigation records">
        <div className="space-y-3">
          {demoInvestigations.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row md:items-center gap-4"
            >
              <div className="flex-1">
                <div className="text-sm font-bold">{item.title}</div>

                <div className="text-xs text-[var(--popu-sub)] mt-1">
                  {item.description}
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[var(--popu-muted)] text-[var(--popu-warning)]">
                Human review
              </span>

              <button
                onClick={() => launch(item.prompt)}
                className="px-3 py-2 rounded-lg border border-[var(--popu-border)] text-xs font-bold"
              >
                Open in agent
              </button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
function DataSources() {
  const registry = getDataRegistrySummary();

  return (
    <div className="space-y-5">
      <Panel title="Active data registry">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-[var(--popu-muted)] border border-[var(--popu-border)]">
            <div className="popu-label">Data mode</div>
            <div className="font-black mt-1">SYNTHETIC DEMO</div>
            <div className="text-[10px] text-[var(--popu-sub)] mt-1">
              No production epidemiological feed is claimed as connected.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--popu-muted)] border border-[var(--popu-border)]">
            <div className="popu-label">Provider</div>
            <div className="font-bold mt-1 text-sm">
              {registry.providerName}
            </div>
            <div className="text-[10px] text-[var(--popu-sub)] mt-1 font-mono">
              {registry.providerId}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--popu-muted)] border border-[var(--popu-border)]">
            <div className="popu-label">Production</div>
            <div className="font-bold mt-1">Not connected</div>
            <div className="text-[10px] text-[var(--popu-sub)] mt-1">
              Adapter boundary ready for approved integrations.
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Approved data-source adapters">
        <div className="space-y-2">
          {PLATFORM_SOURCES.map((source) => (
            <div
              key={source[0]}
              className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 rounded-xl bg-[var(--popu-muted)] border border-[var(--popu-border)]"
            >
              <div className="text-xs font-bold">{source[0]}</div>
              <div className="text-[10px] text-[var(--popu-sub)]">
                {source[1]}
              </div>
              <div className="text-[10px] font-bold text-[var(--popu-teal-dark)]">
                {source[2]}
              </div>
              <div className="text-[10px] text-[var(--popu-sub)]">
                {source[3]}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Models() {
  const models = [
    ['Anomaly Suite', 'Z-score statistical anomaly detection'],
    ['Forecast Engine', 'Time-series forecast - configurable horizon'],
    ['Evidence Retrieval', 'Guideline and literature context'],
  ];

  return (
    <div className="space-y-5">
      <Panel title="POPU model registry">
        <div className="grid md:grid-cols-3 gap-4">
          {models.map(([name, description]) => (
            <div
              key={name}
              className="rounded-xl bg-[var(--popu-muted)] border border-[var(--popu-border)] p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[var(--popu-surface)] flex items-center justify-center border border-[var(--popu-border)]">
                  <CheckCircle2
                    size={15}
                    className="text-[var(--popu-teal)]"
                  />
                </div>

                <div className="min-w-0">
                  <div className="text-sm font-bold">
                    {name}
                  </div>

                  <div className="text-xs text-[var(--popu-sub)] mt-1">
                    {description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Model governance">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="rounded-xl bg-[var(--popu-muted)] border border-[var(--popu-border)] p-4">
            <div className="popu-label">Forecast role</div>
            <div className="font-bold text-sm mt-1">
              Numerical model only
            </div>
            <div className="text-xs text-[var(--popu-sub)] mt-1">
              LLM does not generate numerical forecasts.
            </div>
          </div>

          <div className="rounded-xl bg-[var(--popu-muted)] border border-[var(--popu-border)] p-4">
            <div className="popu-label">AI role</div>
            <div className="font-bold text-sm mt-1">
              Interpretation and orchestration
            </div>
            <div className="text-xs text-[var(--popu-sub)] mt-1">
              AI explains evidence and coordinates investigation tools.
            </div>
          </div>

          <div className="rounded-xl bg-[var(--popu-muted)] border border-[var(--popu-border)] p-4">
            <div className="popu-label">Operational control</div>
            <div className="font-bold text-sm mt-1">
              Human review required
            </div>
            <div className="text-xs text-[var(--popu-sub)] mt-1">
              POPU does not issue autonomous public-health actions.
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function Audit({
  investigationHistory,
}: {
  investigationHistory: import('./types/agent').InvestigationTrace[];
}) {
  return (
    <div className="space-y-5">
      <Panel title="Audit trail">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="popu-label text-[var(--popu-teal)]">
              TRACEABILITY
            </div>

            <p className="text-sm text-[var(--popu-sub)] mt-1">
              Investigation runs, evidence queries and model outputs recorded
              for human review.
            </p>
          </div>

          <div className="rounded-full bg-[var(--popu-muted)] border border-[var(--popu-border)] px-3 py-1.5 text-xs font-bold">
            {investigationHistory.length} session runs
          </div>
        </div>

        {investigationHistory.length === 0 ? (
          <div className="rounded-xl bg-[var(--popu-muted)] border border-[var(--popu-border)] p-6 text-center">
            <div className="text-sm font-bold">
              No investigation runs yet
            </div>

            <div className="text-xs text-[var(--popu-sub)] mt-2">
              Completed investigations will appear here with their execution
              trace and governance metadata.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {investigationHistory.map((trace) => (
              <div
                key={trace.investigationId}
                className="rounded-xl bg-[var(--popu-muted)] border border-[var(--popu-border)] p-4"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold">
                      {trace.intentIdentified.replace(
                        'Backend investigation: ',
                        '',
                      )}
                    </div>

                    <div className="text-xs text-[var(--popu-sub)] mt-1">
                      {trace.investigationId}
                    </div>

                    <div className="text-[10px] text-[var(--popu-sub)] mt-1">
                      {new Date(trace.timestamp).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[var(--popu-surface)] text-[var(--popu-warning)] border border-[var(--popu-border)]">
                      {trace.humanReviewStatus}
                    </span>

                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[var(--popu-surface)] border border-[var(--popu-border)]">
                      Risk {trace.riskScore}/100
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  <div>
                    <div className="popu-label">Risk level</div>
                    <div className="text-xs font-bold mt-1">
                      {trace.riskLevel}
                    </div>
                  </div>

                  <div>
                    <div className="popu-label">Evidence</div>
                    <div className="text-xs font-bold mt-1">
                      {trace.evidenceItemsCount}
                    </div>
                  </div>

                  <div>
                    <div className="popu-label">Tools</div>
                    <div className="text-xs font-bold mt-1">
                      {trace.toolCallsExecuted.length}
                    </div>
                  </div>

                  <div>
                    <div className="popu-label">Agent run</div>
                    <div className="text-xs font-mono mt-1 break-all">
                      {trace.agentRunId}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

function Settings({
  theme,
  setTheme,
}: {
  theme: 'light' | 'dark' | 'system';
  setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark' | 'system'>>;
}) {
  return <div className="grid lg:grid-cols-2 gap-5"><Panel title="Agent governance"><Setting label="Autonomous public-health actions" value="Prohibited"/><Setting label="Human review" value="Mandatory"/><Setting label="Synthetic data isolation" value="Enabled"/><Setting label="LLM as numerical forecast engine" value="Disabled"/></Panel><div className="border-t border-[var(--popu-border)] pt-6 mt-6">
  <div className="text-xs font-bold text-[var(--popu-text)]">
    Appearance
  </div>

  <div className="text-[10px] text-[var(--popu-sub)] mt-1">
    Choose how the POPU workspace looks.
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
    <button
      onClick={() => setTheme('light')}
      className={`text-left rounded-xl p-4 border-2 transition ${
        theme === 'light'
          ? 'border-[var(--popu-teal)] bg-[var(--popu-muted)]'
          : 'border-[var(--popu-border)] bg-[var(--popu-muted)]'
      }`}
    >
      <div className="text-xs font-bold text-[var(--popu-text)]">Light</div>
      <div className="text-[10px] text-[var(--popu-sub)] mt-1">
        Clean clinical workspace
      </div>
    </button>

    <button
      onClick={() => setTheme('dark')}
      className={`text-left rounded-xl p-4 border-2 transition ${
        theme === 'dark'
          ? 'border-[var(--popu-teal)] bg-[var(--popu-muted)]'
          : 'border-[var(--popu-border)] bg-[var(--popu-muted)]'
      }`}
    >
      <div className="text-xs font-bold text-[var(--popu-text)]">Dark</div>
      <div className="text-[10px] text-[var(--popu-sub)] mt-1">
        Low-light workspace
      </div>
    </button>

    <button
      onClick={() => setTheme('system')}
      className={`text-left rounded-xl p-4 border-2 transition ${
        theme === 'system'
          ? 'border-[var(--popu-teal)] bg-[var(--popu-muted)]'
          : 'border-[var(--popu-border)] bg-[var(--popu-muted)]'
      }`}
    >
      <div className="text-xs font-bold text-[var(--popu-text)]">System</div>
      <div className="text-[10px] text-[var(--popu-sub)] mt-1">
        Follow device preference
      </div>
    </button>
  </div>
</div><Panel title="Execution configuration"><Setting label="Anomaly sensitivity" value="Configurable"/><Setting label="Forecast horizon" value="Facility"/><Setting label="Primary role" value="Epidemiological intelligence"/></Panel></div>}
function Setting({label,value}:{label:string;value:string}){return <div className="flex items-center justify-between py-3 border-b border-[var(--popu-border)] last:border-0"><span className="text-xs text-[var(--popu-sub)]">{label}</span><span className="text-xs font-bold">{value}</span></div>}
function Workflow(){return <div className="space-y-2">{['Request','Plan','Tools','Validate','Anomaly','Forecast','Evidence','Interpret','Review'].map((x,i)=><div key={x} className="flex items-center gap-2 text-xs"><span className="w-5 h-5 rounded-full bg-[var(--popu-muted)] text-[var(--popu-teal-dark)] flex items-center justify-center text-[9px] font-bold">{i+1}</span>{x}<ChevronRight size={12} className="ml-auto text-[var(--popu-sub)]"/></div>)}</div>}
function Stat({icon:Icon,label,value,note}:{icon:any;label:string;value:string;note:string}){return <div className="popu-surface rounded-2xl p-4"><Icon size={17} className="text-[var(--popu-teal)]"/><div className="popu-label mt-4">{label}</div><div className="text-2xl font-black mt-1">{value}</div><div className="text-[10px] text-[var(--popu-sub)] mt-1">{note}</div></div>}
function Panel({title,children,className='' }:{title:string;children:React.ReactNode;className?:string}){return <section className={`popu-surface rounded-2xl p-5 ${className}`}><div className="flex items-center justify-between mb-4"><h2 className="font-bold text-sm">{title}</h2><span className="w-1.5 h-1.5 rounded-full bg-[var(--popu-teal)]"/></div>{children}</section>}
function Brief({onClose,onOpen}:{onClose:()=>void;onOpen:()=>void}){return <div className="fixed inset-0 z-50 bg-[var(--popu-navy)]/45 flex items-center justify-center p-5"><div className="bg-[var(--popu-surface)] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"><div className="p-5 border-b border-[var(--popu-border)] flex items-center justify-between"><div><div className="popu-label text-[var(--popu-teal)]">Investigation brief</div><h2 className="text-xl font-black mt-1">POPU intelligence summary</h2></div><button onClick={onClose}><X size={20}/></button></div><div className="p-5 space-y-5"><div className="rounded-xl bg-[var(--popu-muted)] border border-[var(--popu-border)] p-4"><div className="font-black text-sm">SYNTHETIC DEMONSTRATION DATA</div><div className="text-xs text-[var(--popu-sub)] mt-1">This brief is for product demonstration and validation only.</div></div><div><div className="popu-label">System finding</div><p className="text-sm leading-relaxed mt-2">POPU combines surveillance observations, deterministic anomaly detection, forecast outputs and retrieved evidence into an explainable investigation context.</p></div><div className="grid sm:grid-cols-3 gap-3"><div className="p-4 rounded-xl bg-[var(--popu-muted)] border border-[var(--popu-border)]"><div className="popu-label">Signal</div><div className="font-black mt-1">Elevated</div></div><div className="p-4 rounded-xl bg-[var(--popu-muted)] border border-[var(--popu-border)]"><div className="popu-label">Forecast</div><div className="font-black mt-1">14 days</div></div><div className="p-4 rounded-xl bg-[var(--popu-muted)] border border-[var(--popu-border)]"><div className="popu-label">Review</div><div className="font-black mt-1">Required</div></div></div><div className="rounded-xl bg-[var(--popu-navy)] text-white p-4"><div className="flex gap-2 text-xs font-bold"><ShieldCheck size={15} className="text-[var(--popu-teal)]"/>Human review required</div><p className="text-[11px] text-[var(--popu-sub)] mt-2">No autonomous public-health action is issued by POPU.</p></div></div><div className="p-5 border-t border-[var(--popu-border)] flex justify-end gap-2"><button onClick={onClose} className="px-3 py-2 border border-[var(--popu-border)] rounded-lg text-xs font-bold">Close</button><button onClick={onOpen} className="px-3 py-2 bg-[var(--popu-teal)] text-white rounded-lg text-xs font-bold">Open in Agent Workspace</button></div></div></div>}