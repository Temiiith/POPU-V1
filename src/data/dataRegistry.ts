import { DiseaseType } from '../types/agent';
import { ACTIVE_DATA_MODE, getEpidemiologyDataProvider } from '../services/providers/dataProvider';
import { ScenarioLookupResult } from '../types/dataProvider';

export const DATA_REGISTRY_NOTICE =
  'POPU currently runs on explicitly labelled synthetic demonstration data. No production epidemiological feed is claimed as connected.';

export function resolveScenarioData(
  disease: DiseaseType,
  geography: string,
): ScenarioLookupResult {
  return getEpidemiologyDataProvider(ACTIVE_DATA_MODE).getScenario(disease, geography);
}

export function getDataRegistrySummary() {
  const provider = getEpidemiologyDataProvider(ACTIVE_DATA_MODE);
  return {
    mode: provider.mode,
    providerId: provider.id,
    providerName: provider.name,
    productionConnected: false,
    notice: DATA_REGISTRY_NOTICE,
  };
}
