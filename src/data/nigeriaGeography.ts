import { DiseaseType, GeographicLevel } from '../types/agent';
import { resolveScenarioData } from './dataRegistry';

export interface NigeriaGeography {
  id: string;
  name: string;
  level: GeographicLevel;
  aliases: string[];
  parentId?: string;
}

export interface GeographyAvailability {
  disease: DiseaseType;
  available: boolean;
  status: 'Synthetic scenario configured' | 'Data source not configured';
}

/**
 * Administrative geography registry.
 *
 * This catalogue describes where POPU can address an investigation. It is
 * deliberately separate from epidemiological data availability.
 */
const STATE_NAMES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
] as const;

export const NIGERIA_GEOGRAPHY: NigeriaGeography[] = [
  {
    id: 'nga',
    name: 'Nigeria',
    level: 'Country',
    aliases: ['nigeria', 'national'],
  },
  ...STATE_NAMES.map((name) => ({
    id: `state-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name: `${name} State`,
    level: 'State' as const,
    aliases: [name.toLowerCase(), `${name.toLowerCase()} state`],
    parentId: 'nga',
  })),
  {
    id: 'fct',
    name: 'Federal Capital Territory',
    level: 'State',
    aliases: ['fct', 'abuja', 'federal capital territory', 'abuja fct'],
    parentId: 'nga',
  },
];

export const NIGERIA_STATES = NIGERIA_GEOGRAPHY.filter(
  (item) => item.level === 'State' && item.id !== 'fct',
);

export const FCT_GEOGRAPHY = NIGERIA_GEOGRAPHY.find(
  (item) => item.id === 'fct',
) as NigeriaGeography;

/**
 * LGAs currently represented in the synthetic demonstration geography layer.
 * The catalogue is intentionally explicit: absence here means the LGA source
 * is not configured, not that the real-world LGA does not exist.
 */
const CONFIGURED_LGAS: Record<string, string[]> = {
  'state-edo': [
    'Akoko-Edo', 'Egor', 'Esan Central', 'Esan North-East', 'Esan South-East',
    'Esan West', 'Etsako Central', 'Etsako East', 'Etsako West', 'Igueben',
    'Ikpoba-Okha', 'Oredo', 'Orhionmwon', 'Ovia North-East', 'Ovia South-West',
    'Owan East', 'Owan West', 'Uhunmwode',
  ],
  fct: [
    'Abaji', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Municipal Area Council',
  ],
};

export const NIGERIA_LGAS: NigeriaGeography[] = Object.entries(CONFIGURED_LGAS).flatMap(
  ([parentId, names]) => names.map((name) => ({
    id: `lga-${parentId}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name,
    level: 'LGA' as const,
    aliases: [name.toLowerCase()],
    parentId,
  })),
);

export function getStateGeographies(): NigeriaGeography[] {
  return NIGERIA_GEOGRAPHY.filter((item) => item.level === 'State');
}

export function getLGAsForState(stateName: string): NigeriaGeography[] {
  const state = resolveStateGeography(stateName);
  if (!state) return [];

  const stateNode = NIGERIA_GEOGRAPHY.find((item) => item.name === state);
  if (!stateNode) return [];

  return NIGERIA_LGAS.filter((item) => item.parentId === stateNode.id);
}

export function getGeographyAvailability(geography: string): GeographyAvailability[] {
  const diseases: DiseaseType[] = ['Cholera', 'Dengue', 'Lassa fever'];

  return diseases.map((disease) => ({
    disease,
    available: resolveScenarioData(disease, geography).status === 'AVAILABLE',
    status: resolveScenarioData(disease, geography).status === 'AVAILABLE'
      ? 'Synthetic scenario configured'
      : 'Data source not configured',
  }));
}

export function getHealthFacilityStatus(lgaName: string): {
  status: 'Data source not configured';
  message: string;
} {
  return {
    status: 'Data source not configured',
    message: `Health-facility data is not configured for ${lgaName}. POPU will not invent or substitute facility records.`,
  };
}

export function resolveStateGeography(text: string): string | null {
  const normalized = text.trim().toLowerCase();
  const match = NIGERIA_GEOGRAPHY.find(
    (item) =>
      item.level === 'State' &&
      item.aliases.some((alias) => normalized.includes(alias)),
  );

  return match?.name ?? null;
}

export function resolveLgaGeography(text: string, stateName?: string): NigeriaGeography | null {
  const normalized = text.trim().toLowerCase();
  const candidates = stateName ? getLGAsForState(stateName) : NIGERIA_LGAS;

  return candidates.find((item) =>
    item.aliases.some((alias) => normalized.includes(alias)),
  ) ?? null;
}
