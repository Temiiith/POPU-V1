import { DiseaseType } from '../../types/agent';
import {
  getSyntheticScenario,
  SYNTHETIC_DEMO_TAG,
} from '../../mock/syntheticData';
import {
  EpidemiologyDataProvider,
  ScenarioLookupResult,
} from '../../types/dataProvider';

/**
 * Development/demo provider. Every returned scenario is synthetic and must
 * remain visibly labelled throughout the investigation workflow.
 */
export class SyntheticDataProvider implements EpidemiologyDataProvider {
  readonly id = 'synthetic-demo-provider';
  readonly name = 'POPU Synthetic Scenario Provider';
  readonly mode = 'synthetic_demo' as const;

  getScenario(disease: DiseaseType, geography: string): ScenarioLookupResult {
    const scenario = getSyntheticScenario(disease, geography);

    if (!scenario) {
      return {
        status: 'DATA_UNAVAILABLE',
        provider: this.name,
        mode: this.mode,
        disease,
        geography,
        scenario: null,
        message: `${SYNTHETIC_DEMO_TAG}: no scenario is configured for ${disease} in ${geography}. POPU will not substitute another geography or disease.`,
      };
    }

    return {
      status: 'AVAILABLE',
      provider: this.name,
      mode: this.mode,
      disease,
      geography,
      scenario,
      message: `${SYNTHETIC_DEMO_TAG}: scenario available for demonstration and validation only.`,
    };
  }
}
