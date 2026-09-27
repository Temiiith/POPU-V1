import { DiseaseType } from './agent';
import { SyntheticScenario } from '../mock/syntheticData';

export type DataMode = 'synthetic_demo' | 'production';

export type DataAvailabilityStatus =
  | 'AVAILABLE'
  | 'DATA_UNAVAILABLE'
  | 'SOURCE_NOT_CONFIGURED'
  | 'INVALID_GEOGRAPHY';

export interface ScenarioLookupResult {
  status: DataAvailabilityStatus;
  provider: string;
  mode: DataMode;
  disease: DiseaseType;
  geography: string;
  scenario: SyntheticScenario | null;
  message: string;
}

export interface EpidemiologyDataProvider {
  readonly id: string;
  readonly name: string;
  readonly mode: DataMode;
  getScenario(disease: DiseaseType, geography: string): ScenarioLookupResult;
}
