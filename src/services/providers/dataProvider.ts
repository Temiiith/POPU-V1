import { EpidemiologyDataProvider, DataMode } from '../../types/dataProvider';
import { ProductionDataProvider } from './productionDataProvider';
import { SyntheticDataProvider } from './syntheticDataProvider';

const syntheticProvider = new SyntheticDataProvider();
const productionProvider = new ProductionDataProvider();

/**
 * Single provider boundary used by POPU's current demo services.
 * Change this switch when approved production adapters are introduced.
 */
export function getEpidemiologyDataProvider(
  mode: DataMode = 'synthetic_demo',
): EpidemiologyDataProvider {
  return mode === 'production' ? productionProvider : syntheticProvider;
}

export const ACTIVE_DATA_MODE: DataMode = 'synthetic_demo';
