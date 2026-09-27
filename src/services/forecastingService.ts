import { ACTIVE_DATA_MODE, getEpidemiologyDataProvider } from './providers/dataProvider';
/**
 * POPU AI Epidemiological Intelligence Agent
 * Deterministic Forecasting Service
 *
 * Frontend synthetic implementation:
 * - Uses the selected synthetic scenario.
 * - Produces a deterministic trend projection.
 * - Does not allow the LLM to invent forecast values.
 *
 * Future production implementation:
 * FastAPI + validated epidemiological forecasting model.
 */

import {
  ForecastResult,
  ForecastDataPoint,
  DiseaseType,
} from '../types/agent';
import { SYNTHETIC_DEMO_TAG } from '../mock/syntheticData';

export interface ForecastRequestPayload {
  disease: DiseaseType;
  geography: string;
  horizonDays?: number;
}

export class ForecastingService {
  public static forecastDiseaseRisk(
    params: ForecastRequestPayload,
  ): ForecastResult {
    const horizon = Math.max(
      1,
      Math.min(params.horizonDays ?? 14, 30),
    );

    const scenario = getEpidemiologyDataProvider(ACTIVE_DATA_MODE).getScenario(
      params.disease,
      params.geography,
    ).scenario;

    if (!scenario) {
      return {
        disease: params.disease,
        geography: params.geography,
        forecastHorizonDays: horizon,
        predictedValues: [],
        predictionInterval:
          'Unavailable for this synthetic scenario',
        riskScore: 0,
        modelName:
          'Deterministic Trend Projection',
        modelVersion:
          'frontend-synthetic-v1',
        generatedAt: new Date().toISOString(),
        trend: 'stable',
        expectedWeeklyTotal: 0,
        dataStatus: SYNTHETIC_DEMO_TAG,
      };
    }

    const historical = scenario.historicalWeeks;

    const observations = historical.map(
      (item) => item.observed,
    );

    const recentWindow = observations.slice(
      Math.max(0, observations.length - 4),
    );

    const previousWindow = observations.slice(
      Math.max(
        0,
        observations.length - 8,
      ),
      Math.max(
        1,
        observations.length - 4,
      ),
    );

    const recentMean =
      recentWindow.reduce(
        (sum, value) => sum + value,
        0,
      ) / Math.max(recentWindow.length, 1);

    const previousMean =
      previousWindow.length > 0
        ? previousWindow.reduce(
            (sum, value) => sum + value,
            0,
          ) / previousWindow.length
        : recentMean;

    const weeklyChange =
      previousMean > 0
        ? (recentMean - previousMean) /
          previousMean
        : 0;

    const latestObserved =
      observations[observations.length - 1] ??
      0;

    const recentValues =
      observations.slice(
        Math.max(0, observations.length - 6),
      );

    const recentMeanForRisk =
      recentValues.reduce(
        (sum, value) => sum + value,
        0,
      ) / Math.max(recentValues.length, 1);

    const baselineMean =
      historical.reduce(
        (sum, item) => sum + item.baseline,
        0,
      ) / Math.max(historical.length, 1);

    const anomalyRatio =
      baselineMean > 0
        ? latestObserved / baselineMean
        : 0;

    /*
     * Synthetic risk score.
     *
     * This is intentionally a derived demonstration metric,
     * not a validated probability of outbreak.
     */
    const growthComponent = Math.min(
      35,
      Math.max(0, weeklyChange * 100),
    );

    const anomalyComponent = Math.min(
      45,
      Math.max(0, (anomalyRatio - 1) * 20),
    );

    const coverageComponent =
      scenario.reportingCompleteness >= 80
        ? 10
        : scenario.reportingCompleteness >= 60
          ? 7
          : 4;

    const riskScore = Number(
      Math.min(
        100,
        Math.max(
          0,
          30 +
            growthComponent +
            anomalyComponent +
            coverageComponent,
        ),
      ).toFixed(1),
    );

    let trend:
      | 'rapidly_increasing'
      | 'increasing'
      | 'stable'
      | 'decreasing';

    if (weeklyChange >= 0.25) {
      trend = 'rapidly_increasing';
    } else if (weeklyChange >= 0.05) {
      trend = 'increasing';
    } else if (weeklyChange <= -0.05) {
      trend = 'decreasing';
    } else {
      trend = 'stable';
    }

    /*
     * Use the latest observed value as the anchor and
     * project the recent trend with mild dampening.
     */
    const dailyGrowth =
      Math.max(
        -0.05,
        Math.min(
          0.12,
          weeklyChange / 7,
        ),
      );

    const predictedDays: ForecastDataPoint[] = [];

    let projectedTotal = 0;

    for (let index = 0; index < horizon; index++) {
      const day = index + 1;

      const dampening =
        1 / (1 + 0.035 * index);

      const projected =
        latestObserved *
        Math.exp(
          dailyGrowth *
            day *
            dampening,
        );

      const predicted = Math.max(
        0,
        Math.round(projected),
      );

      /*
       * Prediction interval widens with horizon.
       * This is a synthetic uncertainty envelope,
       * not a calibrated statistical confidence interval.
       */
      const uncertainty =
        Math.max(
          2,
          Math.round(
            predicted *
              (0.18 +
                index * 0.015),
          ),
        );

      predictedDays.push({
        date: `Day +${day}`,
        predicted,
        lowerBound: Math.max(
          0,
          predicted - uncertainty,
        ),
        upperBound:
          predicted + uncertainty,
      });

      projectedTotal += predicted;
    }

    const allPoints: ForecastDataPoint[] = [
      ...historical.map((item) => ({
        date: item.week,
        historical: item.observed,
      })),
      ...predictedDays,
    ];

    const expectedWeeklyTotal =
      Math.round(
        (projectedTotal / horizon) * 7,
      );

    return {
      disease: params.disease,
      geography: params.geography,
      forecastHorizonDays: horizon,
      predictedValues: allPoints,
      predictionInterval:
        'Synthetic prediction interval',
      riskScore,
      modelName:
        'POPU Deterministic Trend Projection',
      modelVersion:
        'frontend-synthetic-v1',
      generatedAt:
        new Date().toISOString(),
      trend,
      expectedPeakDate:
        trend === 'rapidly_increasing' ||
        trend === 'increasing'
          ? `Within next ${Math.min(
              horizon,
              7,
            )} days`
          : undefined,
      expectedWeeklyTotal,
      dataStatus: SYNTHETIC_DEMO_TAG,
    };
  }
}
