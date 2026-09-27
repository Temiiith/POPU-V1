import { ACTIVE_DATA_MODE, getEpidemiologyDataProvider } from './providers/dataProvider';
/**
 * POPU AI Epidemiological Intelligence Agent
 * Surveillance & Evidence Retrieval Service
 *
 * This service currently uses explicitly labelled synthetic scenarios.
 *
 * Future integration targets:
 * - SORMAS
 * - DHIS2
 * - Laboratory information systems
 * - Sentinel hospital systems
 * - Hydro-meteorological sources
 * - Environmental monitoring
 * - Approved mobility sources
 */

import { DiseaseType, EvidenceItem } from '../types/agent';
import { SYNTHETIC_DEMO_TAG, SyntheticScenario } from '../mock/syntheticData';

const DATA_UNAVAILABLE =
  'DATA UNAVAILABLE FOR THIS SYNTHETIC SCENARIO';

export class SurveillanceService {
  /**
   * Resolve the selected disease + geography to a synthetic scenario.
   *
   * We deliberately return null when the combination is unavailable.
   * POPU must never silently substitute data from another geography
   * or disease.
   */
  private static resolveScenario(
    disease: DiseaseType,
    geography: string,
  ): SyntheticScenario | null {
    return getEpidemiologyDataProvider(ACTIVE_DATA_MODE).getScenario(disease, geography).scenario;
  }

  /**
   * Retrieves case records for a specified disease and geography.
   */
  public static async getDiseaseCases(
    disease: DiseaseType,
    geography: string,
  ) {
    const scenario = this.resolveScenario(disease, geography);

    if (!scenario) {
      return {
        disease,
        geography,
        timeframe: null,
        totalObservedInPeriod: null,
        latestWeekCount: null,
        reportingCompleteness: null,
        dataStatus: DATA_UNAVAILABLE,
      };
    }

    const totalObservedInPeriod = scenario.historicalWeeks.reduce(
      (total, week) => total + week.observed,
      0,
    );

    const latestWeek =
      scenario.historicalWeeks[scenario.historicalWeeks.length - 1];

    return {
      disease,
      geography,
      timeframe: scenario.timeframe,
      totalObservedInPeriod,
      latestWeekCount: latestWeek?.observed ?? null,
      reportingCompleteness: `${scenario.reportingCompleteness}% synthetic reporting completeness`,
      dataStatus: SYNTHETIC_DEMO_TAG,
    };
  }

  /**
   * Retrieves historical multi-week trends.
   */
  public static async getDiseaseTrends(
    disease: DiseaseType,
    geography: string,
  ) {
    const scenario = this.resolveScenario(disease, geography);

    if (!scenario) {
      return {
        disease,
        geography,
        fiveYearMedianWeek38: null,
        currentWeekObserved: null,
        trendVelocity: null,
        dataStatus: DATA_UNAVAILABLE,
      };
    }

    const observations = scenario.historicalWeeks.map(
      (week) => week.observed,
    );

    const latest = observations[observations.length - 1] ?? 0;

    const previous = observations[observations.length - 2] ?? latest;

    const trendVelocity =
      previous > 0
        ? `${(((latest - previous) / previous) * 100).toFixed(1)}% week-on-week change`
        : 'Insufficient previous-week data';

    const sorted = [...observations].sort((a, b) => a - b);

    const middle = Math.floor(sorted.length / 2);

    const median =
      sorted.length % 2 === 0
        ? ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2
        : sorted[middle] ?? 0;

    return {
      disease,
      geography,
      fiveYearMedianWeek38: Number(median.toFixed(1)),
      currentWeekObserved: latest,
      trendVelocity,
      dataStatus: SYNTHETIC_DEMO_TAG,
    };
  }

  /**
   * Retrieves Local Government Area statistics.
   */
  public static async getLGAStatistics(
    disease: DiseaseType,
    geography: string,
  ) {
    const scenario = this.resolveScenario(disease, geography);

    if (!scenario) {
      return {
        state: geography,
        disease,
        affectedLGAs: [],
        unaffectedLGAsCount: null,
        dataStatus: DATA_UNAVAILABLE,
      };
    }

    const affectedLGAs = scenario.lgas.map((item) => {
      const ratio =
        item.baseline > 0
          ? item.cases / item.baseline
          : Number.POSITIVE_INFINITY;

      let alertLevel: 'HIGH_ANOMALY' | 'ELEVATED' | 'WARNING';

      if (ratio >= 4) {
        alertLevel = 'HIGH_ANOMALY';
      } else if (ratio >= 2) {
        alertLevel = 'ELEVATED';
      } else {
        alertLevel = 'WARNING';
      }

      return {
        lga: item.lga,
        cases: item.cases,
        percentage: item.percentage,
        baseline: item.baseline,
        alertLevel,
      };
    });

    return {
      state: geography,
      disease,
      affectedLGAs,
      unaffectedLGAsCount: null,
      dataStatus: SYNTHETIC_DEMO_TAG,
    };
  }

  /**
   * Hospital admission and syndromic indicators.
   *
   * The disease is required so POPU cannot accidentally use a
   * Cholera hospital scenario for another disease.
   */
  public static async getHospitalSignals(
    disease: DiseaseType,
    geography: string,
  ) {
    const scenario = this.resolveScenario(disease, geography);

    if (!scenario) {
      return {
        geography,
        disease,
        syndrome: null,
        sentinelFacilities: [],
        admissionsLast72h: null,
        bedOccupancyRate: null,
        ivFluidConsumptionDelta: null,
        dataStatus: DATA_UNAVAILABLE,
      };
    }

    return {
      geography,
      disease,
      syndrome: scenario.hospital.syndrome,
      sentinelFacilities: [
        'Synthetic Sentinel Facility A',
        'Synthetic Sentinel Facility B',
        'Synthetic Sentinel Facility C',
      ],
      admissionsLast72h: scenario.hospital.admissionsLast72h,
      bedOccupancyRate: `${scenario.hospital.occupancyPercent}% synthetic occupancy`,
      ivFluidConsumptionDelta: scenario.hospital.indicator,
      dataStatus: SYNTHETIC_DEMO_TAG,
    };
  }

  /**
   * Laboratory diagnostic and confirmatory signals.
   */
  public static async getLaboratorySignals(
    disease: DiseaseType,
    geography: string,
  ) {
    const scenario = this.resolveScenario(disease, geography);

    if (!scenario) {
      return {
        geography,
        disease,
        totalSpecimensTested: null,
        rdtPositive: null,
        culturePositive: null,
        pathogenIsolated: null,
        antibioticSusceptibilityProfile: null,
        pendingSpecimens: null,
        dataStatus: DATA_UNAVAILABLE,
      };
    }

    const positiveSpecimens = scenario.laboratory.positiveSpecimens;

    return {
      geography,
      disease,
      totalSpecimensTested: scenario.laboratory.specimensLast72h,
      rdtPositive: positiveSpecimens,
      culturePositive: null,
      pathogenIsolated: scenario.laboratory.organism,
      antibioticSusceptibilityProfile:
        'Not provided by the synthetic scenario',
      pendingSpecimens: Math.max(
        0,
        scenario.laboratory.specimensLast72h - positiveSpecimens,
      ),
      dataStatus: SYNTHETIC_DEMO_TAG,
    };
  }

  /**
   * Weather and hydrological indicators.
   */
  public static async getWeatherData(
    disease: DiseaseType,
    geography: string,
  ) {
    const scenario = this.resolveScenario(disease, geography);

    if (!scenario) {
      return {
        geography,
        disease,
        cumulativeRainfallLast14Days: null,
        normalRainfallBaseline: null,
        rainfallAnomaly: null,
        averageTemperature: null,
        soilSaturationIndex: null,
        dataStatus: DATA_UNAVAILABLE,
      };
    }

    return {
      geography,
      disease,
      cumulativeRainfallLast14Days:
        `${scenario.weather.cumulativeRainfallLast14Days} mm`,
      normalRainfallBaseline:
        `${scenario.weather.normalRainfallBaseline} mm`,
      rainfallAnomaly:
        `${scenario.weather.rainfallAnomaly >= 0 ? '+' : ''}${scenario.weather.rainfallAnomaly} mm`,
      averageTemperature:
        `${scenario.weather.averageTemperature}°C`,
      soilSaturationIndex: 'Not provided by the synthetic scenario',
      dataStatus: SYNTHETIC_DEMO_TAG,
    };
  }

  /**
   * Environmental sanitary and flood signals.
   */
  public static async getEnvironmentalSignals(
    disease: DiseaseType,
    geography: string,
  ) {
    const scenario = this.resolveScenario(disease, geography);

    if (!scenario) {
      return {
        geography,
        disease,
        riverBasin: null,
        turbidityNTU: null,
        waterPointContaminationRate: null,
        wasteDisposalDrainageBlockageReported: null,
        description: null,
        anomaly: null,
        dataStatus: DATA_UNAVAILABLE,
      };
    }

    return {
      geography,
      disease,
      riverBasin: 'Synthetic environmental context',
      turbidityNTU: null,
      waterPointContaminationRate: null,
      wasteDisposalDrainageBlockageReported: null,
      description: scenario.environment.description,
      anomaly: scenario.environment.anomaly,
      dataStatus: SYNTHETIC_DEMO_TAG,
    };
  }

  /**
   * Mobility patterns.
   */
  public static async getMobilitySignals(
    disease: DiseaseType,
    geography: string,
  ) {
    const scenario = this.resolveScenario(disease, geography);

    if (!scenario) {
      return {
        geography,
        disease,
        marketDayCongregation: null,
        interLGAMobilityIndex: null,
        dataStatus: DATA_UNAVAILABLE,
      };
    }

    return {
      geography,
      disease,
      marketDayCongregation: scenario.mobility.description,
      interLGAMobilityIndex:
        `${scenario.mobility.indexChangePercent >= 0 ? '+' : ''}${scenario.mobility.indexChangePercent}% synthetic mobility change`,
      dataStatus: SYNTHETIC_DEMO_TAG,
    };
  }

  /**
   * Evidence bundle collector.
   */
  public static getEvidenceBundle(
    disease: DiseaseType,
    geography: string,
  ): EvidenceItem[] {
    const scenario = this.resolveScenario(disease, geography);

    if (!scenario) {
      return [];
    }

    return scenario.evidence;
  }

  /**
   * Guideline retrieval placeholder.
   *
   * This synthetic provider does not claim to retrieve live guidelines.
   * Real guideline retrieval will be added through an evidence adapter.
   */
  public static searchGuidelines(disease: DiseaseType) {
    return {
      disease,
      guidelineSource:
        'No live guideline source connected to the synthetic provider',
      keyActions: [
        'Verify the signal against authoritative surveillance data',
        'Review laboratory and clinical evidence',
        'Assess geographic clustering and reporting completeness',
        'Escalate to qualified public-health personnel for human review',
      ],
      dataStatus: SYNTHETIC_DEMO_TAG,
    };
  }
}
