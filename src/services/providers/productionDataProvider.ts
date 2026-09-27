import { DiseaseType } from '../../types/agent';
import {
  EpidemiologyDataProvider,
  ScenarioLookupResult,
} from '../../types/dataProvider';

/**
 * Production integration boundary.
 *
 * No real-world source is claimed to be connected in the MVP. Future adapters
 * (for example SORMAS, DHIS2, laboratory, hospital or approved environmental
 * feeds) should implement this contract rather than changing agent logic.
 */
export class ProductionDataProvider implements EpidemiologyDataProvider {
  readonly id = 'production-provider-pending';
  readonly name = 'POPU Production Data Provider';
  readonly mode = 'production' as const;

  getScenario(disease: DiseaseType, geography: string): ScenarioLookupResult {
    return {
      status: 'SOURCE_NOT_CONFIGURED',
      provider: this.name,
      mode: this.mode,
      disease,
      geography,
      scenario: null,
      message: `Production data source is not configured for ${disease} in ${geography}.`,
    };
  }
}
