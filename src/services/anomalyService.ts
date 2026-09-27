import { ACTIVE_DATA_MODE, getEpidemiologyDataProvider } from './providers/dataProvider';
/**
 * POPU AI Epidemiological Intelligence Agent
 * Deterministic Anomaly Detection Service
 *
 * The agent does not calculate anomalies.
 * This service performs the numerical calculation from the selected
 * synthetic scenario and returns explicit model output.
 */

import {
  AnomalyMethod,
  AnomalyResult,
  AnomalyDataPoint,
  DiseaseType,
} from '../types/agent';
import { SYNTHETIC_DEMO_TAG } from '../mock/syntheticData';

export interface AnomalyRequestPayload {
  disease: DiseaseType;
  geography: string;
  method: AnomalyMethod;
  sensitivity?: number;
}

export class AnomalyService {
  public static detectAnomaly(
    params: AnomalyRequestPayload,
  ): AnomalyResult {
    const scenario = getEpidemiologyDataProvider(ACTIVE_DATA_MODE).getScenario(
      params.disease,
      params.geography,
    ).scenario;

    if (!scenario) {
      return {
        disease: params.disease,
        geography: params.geography,
        observedValue: 0,
        expectedBaseline: 0,
        deviationPercent: 0,
        zScore: 0,
        method: params.method,
        detectionDate: 'Data unavailable',
        status: 'Within Expected Baseline',
        uncertainty:
          'Data unavailable for this synthetic scenario.',
        timeSeries: [],
        dataStatus: SYNTHETIC_DEMO_TAG,
        modelConfidence: 0,
      };
    }

    const rawSeries = scenario.historicalWeeks;
    const values = rawSeries.map((point) => point.observed);

    const baselineValues = rawSeries
      .slice(0, Math.max(1, rawSeries.length - 4))
      .map((point) => point.observed);

    const mean =
      baselineValues.reduce((sum, value) => sum + value, 0) /
      baselineValues.length;

    const variance =
      baselineValues.length > 1
        ? baselineValues.reduce(
            (sum, value) => sum + Math.pow(value - mean, 2),
            0,
          ) /
          (baselineValues.length - 1)
        : 0;

    const stdDev = Math.sqrt(variance) || 1;

    const latestObserved = values[values.length - 1] ?? 0;

    const zScore =
      (latestObserved - mean) / stdDev;

    const deviationPercent =
      mean > 0
        ? ((latestObserved - mean) / mean) * 100
        : 0;

    const sensitivity = params.sensitivity ?? 2;

    let points: AnomalyDataPoint[] = [];

    switch (params.method) {
      case 'Z-score':
        points = rawSeries.map((item) => ({
          date: item.week,
          observed: item.observed,
          baseline: Number(mean.toFixed(1)),
          upperThreshold: Number(
            (mean + sensitivity * stdDev).toFixed(1),
          ),
          isAnomaly:
            (item.observed - mean) / stdDev >= sensitivity,
        }));
        break;

      case 'Rolling baseline':
        points = rawSeries.map((item, index) => {
          const start = Math.max(0, index - 4);
          const window = values.slice(start, index);

          const rollingMean =
            window.length > 0
              ? window.reduce((sum, value) => sum + value, 0) /
                window.length
              : mean;

          const upperThreshold =
            rollingMean * 1.75;

          return {
            date: item.week,
            observed: item.observed,
            baseline: Number(rollingMean.toFixed(1)),
            upperThreshold: Number(
              upperThreshold.toFixed(1),
            ),
            isAnomaly:
              item.observed > upperThreshold,
          };
        });
        break;

      case 'Seasonal baseline':
        points = rawSeries.map((item) => ({
          date: item.week,
          observed: item.observed,
          baseline: item.baseline,
          upperThreshold: item.upperThreshold,
          isAnomaly:
            item.observed > item.upperThreshold,
        }));
        break;

      case 'EWMA': {
        const lambda = 0.3;
        let ewma = mean;

        points = rawSeries.map((item, index) => {
          ewma =
            lambda * item.observed +
            (1 - lambda) * ewma;

          const ewmaStd =
            stdDev *
            Math.sqrt(
              (lambda / (2 - lambda)) *
                (1 -
                  Math.pow(
                    1 - lambda,
                    2 * (index + 1),
                  )),
            );

          const upperThreshold =
            ewma + sensitivity * ewmaStd;

          return {
            date: item.week,
            observed: item.observed,
            baseline: Number(ewma.toFixed(1)),
            upperThreshold: Number(
              upperThreshold.toFixed(1),
            ),
            isAnomaly:
              item.observed > upperThreshold,
          };
        });

        break;
      }

      case 'CUSUM': {
        const k = 0.5 * stdDev;
        const h = 4 * stdDev;
        let cumulative = 0;

        points = rawSeries.map((item) => {
          cumulative = Math.max(
            0,
            cumulative +
              (item.observed - mean) -
              k,
          );

          return {
            date: item.week,
            observed: item.observed,
            baseline: Number(mean.toFixed(1)),
            upperThreshold: Number(
              (mean + h).toFixed(1),
            ),
            isAnomaly:
              cumulative > h,
          };
        });

        break;
      }

      default:
        points = rawSeries.map((item) => ({
          date: item.week,
          observed: item.observed,
          baseline: item.baseline,
          upperThreshold: item.upperThreshold,
          isAnomaly:
            item.observed > item.upperThreshold,
        }));
    }

    const latestPoint =
      points[points.length - 1];

    const isElevated =
      zScore >= sensitivity ||
      latestObserved >
        (latestPoint?.upperThreshold ?? mean);

    const latestWeek =
      rawSeries[rawSeries.length - 1]?.week ??
      'Current period';

    const confidence = Math.min(
      0.99,
      Math.max(
        0.5,
        0.72 +
          Math.min(Math.abs(zScore) / 20, 0.22),
      ),
    );

    return {
      disease: params.disease,
      geography: params.geography,
      observedValue: latestObserved,
      expectedBaseline: Number(mean.toFixed(1)),
      deviationPercent: Number(
        deviationPercent.toFixed(1),
      ),
      zScore: Number(zScore.toFixed(2)),
      method: params.method,
      detectionDate: `${latestWeek} synthetic observation`,
      status: isElevated
        ? 'Elevated Signal Detected'
        : 'Within Expected Baseline',
      uncertainty:
        'Synthetic scenario uncertainty remains because reporting completeness, laboratory turnaround, and source coverage are not equivalent to validated operational surveillance data.',
      timeSeries: points,
      dataStatus: SYNTHETIC_DEMO_TAG,
      modelConfidence: Number(
        confidence.toFixed(2),
      ),
    };
  }
}
