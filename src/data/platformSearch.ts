export const PLATFORM_SIGNALS = [
  {
    id: 'SIG-001',
    disease: 'Cholera',
    geo: 'Edo State',
    level: 'Elevated signal',
    source: 'Surveillance + hospital + laboratory',
  },
  {
    id: 'SIG-002',
    disease: 'Lassa fever',
    geo: 'Edo State',
    level: 'Requires investigation',
    source: 'Syndromic surveillance + lab',
  },
  {
    id: 'SIG-003',
    disease: 'Dengue',
    geo: 'Lagos State',
    level: 'Baseline monitoring',
    source: 'Surveillance',
  },
] as const;

export const PLATFORM_DISEASES = [
  {
    name: 'Cholera',
    category: 'Waterborne / fecal-oral',
  },
  {
    name: 'Lassa fever',
    category: 'Zoonotic / nosocomial',
  },
  {
    name: 'Dengue',
    category: 'Vector-borne',
  },
] as const;

export const PLATFORM_SOURCES = [
  'Integrated surveillance',
  'Hospital signals',
  'Laboratory',
  'Environment / weather',
  'Mobility / community',
] as const;