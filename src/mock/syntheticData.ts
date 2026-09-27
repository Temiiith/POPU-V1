import { DiseaseType, EvidenceItem } from '../types/agent';

export const SYNTHETIC_DEMO_TAG =
  'SYNTHETIC DEMONSTRATION DATA' as const;

export interface HistoricalWeek {
  week: string;
  observed: number;
  baseline: number;
  upperThreshold: number;
}

export interface SyntheticLGA {
  lga: string;
  cases: number;
  baseline: number;
  percentage: number;
}

export interface SyntheticScenario {
  id: string;
  disease: DiseaseType;
  geography: string;
  timeframe: string;

  historicalWeeks: HistoricalWeek[];

  reportingCompleteness: number;

  lgas: SyntheticLGA[];

  hospital: {
    syndrome: string;
    admissionsLast72h: number;
    occupancyPercent: number;
    indicator: string;
  };

  laboratory: {
    specimensLast72h: number;
    positiveSpecimens: number;
    positivityPercent: number;
    organism: string;
  };

  weather: {
    cumulativeRainfallLast14Days: number;
    normalRainfallBaseline: number;
    rainfallAnomaly: number;
    averageTemperature: number;
  };

  environment: {
    description: string;
    anomaly: string;
  };

  mobility: {
    description: string;
    indexChangePercent: number;
  };

  evidence: EvidenceItem[];
}

/**
 * --------------------------------------------------------------------------
 * CHOLERA — EDO STATE
 * --------------------------------------------------------------------------
 *
 * Synthetic demonstration scenario only.
 *
 * This is deliberately separate from real surveillance data.
 */
const EDO_CHOLERA_HISTORICAL_WEEKS: HistoricalWeek[] = [
  { week: 'EW27', observed: 11, baseline: 14, upperThreshold: 22 },
  { week: 'EW28', observed: 13, baseline: 14, upperThreshold: 22 },
  { week: 'EW29', observed: 15, baseline: 15, upperThreshold: 23 },
  { week: 'EW30', observed: 12, baseline: 15, upperThreshold: 23 },
  { week: 'EW31', observed: 17, baseline: 15, upperThreshold: 24 },
  { week: 'EW32', observed: 16, baseline: 15, upperThreshold: 24 },
  { week: 'EW33', observed: 18, baseline: 16, upperThreshold: 25 },
  { week: 'EW34', observed: 19, baseline: 16, upperThreshold: 25 },
  { week: 'EW35', observed: 21, baseline: 17, upperThreshold: 27 },
  { week: 'EW36', observed: 27, baseline: 17, upperThreshold: 28 },
  { week: 'EW37', observed: 39, baseline: 18, upperThreshold: 30 },
  { week: 'EW38', observed: 62, baseline: 18, upperThreshold: 31 },
];

const EDO_CHOLERA_EVIDENCE: EvidenceItem[] = [
  {
    id: 'edo-cholera-surveillance',
    category: 'SURVEILLANCE',
    label: 'OBSERVED DATA',
    source: 'Synthetic Integrated Disease Surveillance Adapter',
    timestamp: '2026-09-24T12:00:00Z',
    geography: 'Edo State',
    dataType: 'Weekly surveillance',
    metric: 'Reported cholera cases',
    value: 62,
    baselineComparison: '62 observed vs 18 synthetic baseline',
    status: 'elevated',
    isObservedOrDerived: 'observed',
    confidenceScore: 0.86,
    syntheticTag: SYNTHETIC_DEMO_TAG,
  },
  {
    id: 'edo-cholera-hospital',
    category: 'HOSPITAL',
    label: 'OBSERVED DATA',
    source: 'Synthetic Sentinel Hospital Adapter',
    timestamp: '2026-09-24T12:00:00Z',
    geography: 'Edo State',
    dataType: 'Syndromic surveillance',
    metric: 'Acute watery diarrhoea admissions',
    value: 31,
    baselineComparison: 'Elevated relative to synthetic baseline',
    status: 'elevated',
    isObservedOrDerived: 'observed',
    confidenceScore: 0.79,
    syntheticTag: SYNTHETIC_DEMO_TAG,
  },
  {
    id: 'edo-cholera-laboratory',
    category: 'LABORATORY',
    label: 'OBSERVED DATA',
    source: 'Synthetic Laboratory Adapter',
    timestamp: '2026-09-24T12:00:00Z',
    geography: 'Edo State',
    dataType: 'Laboratory testing',
    metric: 'Positive specimens',
    value: 22,
    baselineComparison: 'Synthetic positivity increase',
    status: 'elevated',
    isObservedOrDerived: 'observed',
    confidenceScore: 0.81,
    syntheticTag: SYNTHETIC_DEMO_TAG,
  },
  {
    id: 'edo-cholera-weather',
    category: 'ENVIRONMENT',
    label: 'OBSERVED DATA',
    source: 'Synthetic Hydro-Meteorological Adapter',
    timestamp: '2026-09-24T12:00:00Z',
    geography: 'Edo State',
    dataType: 'Rainfall',
    metric: '14-day rainfall anomaly',
    value: '+72.4 mm',
    baselineComparison: 'Above synthetic seasonal baseline',
    status: 'elevated',
    isObservedOrDerived: 'observed',
    confidenceScore: 0.74,
    syntheticTag: SYNTHETIC_DEMO_TAG,
  },
  {
    id: 'edo-cholera-geography',
    category: 'GEOGRAPHIC',
    label: 'DERIVED STATISTIC',
    source: 'Synthetic Geographic Aggregator',
    timestamp: '2026-09-24T12:00:00Z',
    geography: 'Edo State',
    dataType: 'LGA clustering',
    metric: 'High-signal LGAs',
    value: 'Egor, Ikpoba-Okha, Oredo',
    baselineComparison: 'Spatial concentration in synthetic scenario',
    status: 'elevated',
    isObservedOrDerived: 'derived',
    confidenceScore: 0.77,
    syntheticTag: SYNTHETIC_DEMO_TAG,
  },
];

export const EDO_CHOLERA_SCENARIO: SyntheticScenario = {
  id: 'synthetic-edo-cholera-2026-ew38',
  disease: 'Cholera',
  geography: 'Edo State',
  timeframe: 'Epi-Week 27 to Week 38, 2026',

  historicalWeeks: EDO_CHOLERA_HISTORICAL_WEEKS,

  reportingCompleteness: 76.4,

  lgas: [
    {
      lga: 'Egor',
      cases: 23,
      baseline: 5,
      percentage: 37.1,
    },
    {
      lga: 'Ikpoba-Okha',
      cases: 17,
      baseline: 4,
      percentage: 27.4,
    },
    {
      lga: 'Oredo',
      cases: 13,
      baseline: 3,
      percentage: 21.0,
    },
    {
      lga: 'Other LGAs',
      cases: 9,
      baseline: 8,
      percentage: 14.5,
    },
  ],

  hospital: {
    syndrome: 'Acute Watery Diarrhoea & Severe Dehydration',
    admissionsLast72h: 31,
    occupancyPercent: 82,
    indicator: '+185% IV fluid utilisation',
  },

  laboratory: {
    specimensLast72h: 43,
    positiveSpecimens: 22,
    positivityPercent: 51.2,
    organism: 'Vibrio cholerae O1 — synthetic demonstration result',
  },

  weather: {
    cumulativeRainfallLast14Days: 182.7,
    normalRainfallBaseline: 110.3,
    rainfallAnomaly: 72.4,
    averageTemperature: 27.1,
  },

  environment: {
    description:
      'Synthetic water-quality and sanitation indicators show elevated environmental concern.',
    anomaly:
      'Synthetic demonstration scenario includes increased turbidity and drainage stress.',
  },

  mobility: {
    description:
      'Synthetic scenario indicates increased movement around major commercial and transport corridors.',
    indexChangePercent: 11.4,
  },

  evidence: EDO_CHOLERA_EVIDENCE,
};

/**
 * --------------------------------------------------------------------------
 * LASSA FEVER — EDO STATE
 * --------------------------------------------------------------------------
 *
 * A separate synthetic scenario demonstrates that POPU is not tied to
 * cholera-specific assumptions.
 */
const EDO_LASSA_HISTORICAL_WEEKS: HistoricalWeek[] = [
  { week: 'EW27', observed: 5, baseline: 7, upperThreshold: 12 },
  { week: 'EW28', observed: 6, baseline: 7, upperThreshold: 12 },
  { week: 'EW29', observed: 8, baseline: 7, upperThreshold: 13 },
  { week: 'EW30', observed: 7, baseline: 7, upperThreshold: 13 },
  { week: 'EW31', observed: 9, baseline: 8, upperThreshold: 14 },
  { week: 'EW32', observed: 8, baseline: 8, upperThreshold: 14 },
  { week: 'EW33', observed: 10, baseline: 8, upperThreshold: 15 },
  { week: 'EW34', observed: 12, baseline: 8, upperThreshold: 15 },
  { week: 'EW35', observed: 14, baseline: 9, upperThreshold: 16 },
  { week: 'EW36', observed: 18, baseline: 9, upperThreshold: 17 },
  { week: 'EW37', observed: 23, baseline: 10, upperThreshold: 18 },
  { week: 'EW38', observed: 28, baseline: 10, upperThreshold: 19 },
];

const EDO_LASSA_EVIDENCE: EvidenceItem[] = [
  {
    id: 'edo-lassa-surveillance',
    category: 'SURVEILLANCE',
    label: 'OBSERVED DATA',
    source: 'Synthetic Integrated Disease Surveillance Adapter',
    timestamp: '2026-09-24T12:00:00Z',
    geography: 'Edo State',
    dataType: 'Weekly surveillance',
    metric: 'Reported suspected Lassa fever cases',
    value: 28,
    baselineComparison: '28 observed vs 10 synthetic baseline',
    status: 'elevated',
    isObservedOrDerived: 'observed',
    confidenceScore: 0.81,
    syntheticTag: SYNTHETIC_DEMO_TAG,
  },
  {
    id: 'edo-lassa-hospital',
    category: 'HOSPITAL',
    label: 'OBSERVED DATA',
    source: 'Synthetic Sentinel Hospital Adapter',
    timestamp: '2026-09-24T12:00:00Z',
    geography: 'Edo State',
    dataType: 'Syndromic surveillance',
    metric: 'Compatible febrile illness admissions',
    value: 18,
    baselineComparison: 'Elevated relative to synthetic baseline',
    status: 'elevated',
    isObservedOrDerived: 'observed',
    confidenceScore: 0.76,
    syntheticTag: SYNTHETIC_DEMO_TAG,
  },
  {
    id: 'edo-lassa-lab',
    category: 'LABORATORY',
    label: 'OBSERVED DATA',
    source: 'Synthetic Laboratory Adapter',
    timestamp: '2026-09-24T12:00:00Z',
    geography: 'Edo State',
    dataType: 'Laboratory testing',
    metric: 'Positive specimens',
    value: 11,
    baselineComparison: 'Synthetic positivity increase',
    status: 'elevated',
    isObservedOrDerived: 'observed',
    confidenceScore: 0.78,
    syntheticTag: SYNTHETIC_DEMO_TAG,
  },
];

export const EDO_LASSA_SCENARIO: SyntheticScenario = {
  id: 'synthetic-edo-lassa-2026-ew38',
  disease: 'Lassa fever',
  geography: 'Edo State',
  timeframe: 'Epi-Week 27 to Week 38, 2026',

  historicalWeeks: EDO_LASSA_HISTORICAL_WEEKS,

  reportingCompleteness: 71.8,

  lgas: [
    {
      lga: 'Egor',
      cases: 10,
      baseline: 3,
      percentage: 35.7,
    },
    {
      lga: 'Oredo',
      cases: 8,
      baseline: 2,
      percentage: 28.6,
    },
    {
      lga: 'Ikpoba-Okha',
      cases: 6,
      baseline: 2,
      percentage: 21.4,
    },
    {
      lga: 'Other LGAs',
      cases: 4,
      baseline: 5,
      percentage: 14.3,
    },
  ],

  hospital: {
    syndrome: 'Compatible febrile illness',
    admissionsLast72h: 18,
    occupancyPercent: 68,
    indicator: '+96% increase in compatible admissions',
  },

  laboratory: {
    specimensLast72h: 27,
    positiveSpecimens: 11,
    positivityPercent: 40.7,
    organism: 'Lassa virus — synthetic demonstration result',
  },

  weather: {
    cumulativeRainfallLast14Days: 96.2,
    normalRainfallBaseline: 101.4,
    rainfallAnomaly: -5.2,
    averageTemperature: 27.8,
  },

  environment: {
    description:
      'Synthetic environmental indicators are included only as contextual inputs.',
    anomaly:
      'No dominant synthetic environmental anomaly is assigned to this scenario.',
  },

  mobility: {
    description:
      'Synthetic scenario indicates moderate movement across urban corridors.',
    indexChangePercent: 6.2,
  },

  evidence: EDO_LASSA_EVIDENCE,
};

/**
 * --------------------------------------------------------------------------
 * DENGUE — EDO STATE
 * --------------------------------------------------------------------------
 *
 * Synthetic demonstration scenario only. It is intentionally distinct from
 * the cholera and Lassa scenarios so the engine can exercise disease-specific
 * evidence without implying that the numbers are real surveillance data.
 */
const EDO_DENGUE_HISTORICAL_WEEKS: HistoricalWeek[] = [
  { week: 'EW27', observed: 4, baseline: 6, upperThreshold: 10 },
  { week: 'EW28', observed: 5, baseline: 6, upperThreshold: 10 },
  { week: 'EW29', observed: 7, baseline: 6, upperThreshold: 11 },
  { week: 'EW30', observed: 6, baseline: 7, upperThreshold: 11 },
  { week: 'EW31', observed: 8, baseline: 7, upperThreshold: 12 },
  { week: 'EW32', observed: 9, baseline: 7, upperThreshold: 12 },
  { week: 'EW33', observed: 11, baseline: 8, upperThreshold: 13 },
  { week: 'EW34', observed: 13, baseline: 8, upperThreshold: 14 },
  { week: 'EW35', observed: 16, baseline: 9, upperThreshold: 15 },
  { week: 'EW36', observed: 21, baseline: 9, upperThreshold: 16 },
  { week: 'EW37', observed: 26, baseline: 10, upperThreshold: 18 },
  { week: 'EW38', observed: 34, baseline: 10, upperThreshold: 18 },
];

const EDO_DENGUE_EVIDENCE: EvidenceItem[] = [
  {
    id: 'edo-dengue-surveillance', category: 'SURVEILLANCE', label: 'OBSERVED DATA',
    source: 'Synthetic Integrated Disease Surveillance Adapter', timestamp: '2026-09-24T12:00:00Z',
    geography: 'Edo State', dataType: 'Weekly surveillance', metric: 'Reported suspected dengue cases',
    value: 34, baselineComparison: '34 observed vs 10 synthetic baseline', status: 'elevated',
    isObservedOrDerived: 'observed', confidenceScore: 0.78, syntheticTag: SYNTHETIC_DEMO_TAG,
  },
  {
    id: 'edo-dengue-hospital', category: 'HOSPITAL', label: 'OBSERVED DATA',
    source: 'Synthetic Sentinel Hospital Adapter', timestamp: '2026-09-24T12:00:00Z',
    geography: 'Edo State', dataType: 'Syndromic surveillance', metric: 'Acute febrile illness admissions',
    value: 19, baselineComparison: 'Elevated relative to synthetic baseline', status: 'elevated',
    isObservedOrDerived: 'observed', confidenceScore: 0.72, syntheticTag: SYNTHETIC_DEMO_TAG,
  },
  {
    id: 'edo-dengue-lab', category: 'LABORATORY', label: 'OBSERVED DATA',
    source: 'Synthetic Laboratory Adapter', timestamp: '2026-09-24T12:00:00Z',
    geography: 'Edo State', dataType: 'Laboratory testing', metric: 'Dengue-positive specimens',
    value: 9, baselineComparison: '9 of 24 synthetic specimens positive (37.5%)', status: 'elevated',
    isObservedOrDerived: 'observed', confidenceScore: 0.74, syntheticTag: SYNTHETIC_DEMO_TAG,
  },
  {
    id: 'edo-dengue-weather', category: 'ENVIRONMENT', label: 'OBSERVED DATA',
    source: 'Synthetic Hydro-meteorological Adapter', timestamp: '2026-09-24T12:00:00Z',
    geography: 'Edo State', dataType: 'Meteorological context', metric: 'Rainfall anomaly',
    value: '+28.6 mm', baselineComparison: 'Synthetic rainfall above reference period', status: 'informational',
    isObservedOrDerived: 'observed', confidenceScore: 0.68, syntheticTag: SYNTHETIC_DEMO_TAG,
  },
  {
    id: 'edo-dengue-geography', category: 'GEOGRAPHIC', label: 'DERIVED STATISTIC',
    source: 'Synthetic Geographic Aggregation Adapter', timestamp: '2026-09-24T12:00:00Z',
    geography: 'Edo State', dataType: 'LGA clustering', metric: 'Higher synthetic activity areas',
    value: 'Egor, Oredo, Ikpoba-Okha', baselineComparison: 'Clustered synthetic signal', status: 'elevated',
    isObservedOrDerived: 'derived', confidenceScore: 0.71, syntheticTag: SYNTHETIC_DEMO_TAG,
  },
];

const EDO_DENGUE_SCENARIO: SyntheticScenario = {
  id: 'synthetic-edo-dengue-2026-ew38', disease: 'Dengue', geography: 'Edo State',
  timeframe: 'EW27–EW38 2026', historicalWeeks: EDO_DENGUE_HISTORICAL_WEEKS, reportingCompleteness: 73.6,
  lgas: [
    { lga: 'Egor', cases: 12, baseline: 3, percentage: 35.3 },
    { lga: 'Oredo', cases: 9, baseline: 2, percentage: 26.5 },
    { lga: 'Ikpoba-Okha', cases: 7, baseline: 2, percentage: 20.6 },
    { lga: 'Other LGAs', cases: 6, baseline: 5, percentage: 17.6 },
  ],
  hospital: { syndrome: 'Acute febrile illness', admissionsLast72h: 19, occupancyPercent: 64, indicator: '+88% IV fluid and observation utilisation — synthetic' },
  laboratory: { specimensLast72h: 24, positiveSpecimens: 9, positivityPercent: 37.5, organism: 'Dengue virus — synthetic demonstration result' },
  weather: { cumulativeRainfallLast14Days: 138.9, normalRainfallBaseline: 110.3, rainfallAnomaly: 28.6, averageTemperature: 27.4 },
  environment: { description: 'Synthetic vector-breeding context around water-holding containers and drainage areas.', anomaly: 'Increased vector-conducive environmental context — synthetic' },
  mobility: { description: 'Synthetic moderate increase around commercial and transport corridors.', indexChangePercent: 7.8 },
  evidence: EDO_DENGUE_EVIDENCE,
};

/**
 * --------------------------------------------------------------------------
 * SCENARIO REGISTRY
 * --------------------------------------------------------------------------
 */

export const SYNTHETIC_SCENARIOS: SyntheticScenario[] = [
  EDO_CHOLERA_SCENARIO,
  EDO_LASSA_SCENARIO,
  EDO_DENGUE_SCENARIO,
];

export function getSyntheticScenario(
  disease: DiseaseType,
  geography: string,
): SyntheticScenario | null {
  const normalizedDisease = disease.trim().toLowerCase();
  const normalizedGeography = geography.trim().toLowerCase();

  return (
    SYNTHETIC_SCENARIOS.find(
      (scenario) =>
        scenario.disease.toLowerCase() === normalizedDisease &&
        scenario.geography.toLowerCase() === normalizedGeography,
    ) ?? null
  );
}
