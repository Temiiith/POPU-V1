/**
 * POPU AI Epidemiological Intelligence Agent
 * Agent Orchestration Engine
 *
 * Orchestrates:
 * Intent -> Plan -> Data Tools -> Anomaly Engine -> Forecasting Engine
 * -> Evidence Fusion -> AI Interpretation -> Recommendations
 *
 * Important:
 * - Numerical anomaly and forecast calculations come from deterministic services.
 * - The agent does not invent epidemiological values.
 * - Synthetic scenarios are explicitly labeled.
 * - Human review remains mandatory.
 */

import {
  DiseaseType,
  InvestigationStep,
  ToolExecution,
  EvidenceItem,
  AnomalyResult,
  ForecastResult,
  RiskAssessment,
  UncertaintyAnalysis,
  AIInterpretation,
  RecommendationAction,
  InvestigationTrace,
} from '../types/agent';

import { AnomalyService } from './anomalyService';
import { ForecastingService } from './forecastingService';
import { SurveillanceService } from './surveillanceService';
import { resolveStateGeography } from '../data/nigeriaGeography';
import { ACTIVE_DATA_MODE, getEpidemiologyDataProvider } from './providers/dataProvider';

import { SYNTHETIC_DEMO_TAG } from '../mock/syntheticData';

export interface AgentExecutionState {
  isInvestigating: boolean;
  activeStepId: string | null;
  steps: InvestigationStep[];
  toolsExecuted: ToolExecution[];
  evidence: EvidenceItem[];
  anomaly: AnomalyResult | null;
  forecast: ForecastResult | null;
  riskAssessment: RiskAssessment | null;
  uncertainty: UncertaintyAnalysis | null;
  aiInterpretation: AIInterpretation | null;
  recommendations: RecommendationAction[];
  trace: InvestigationTrace | null;
  activeDisease: DiseaseType;
  activeGeography: string;
  dataAvailabilityStatus: 'not_checked' | 'available' | 'unavailable';
  dataAvailabilityMessage: string | null;
}

export const INITIAL_INVESTIGATION_STEPS: InvestigationStep[] = [
  {
    id: 'step-01',
    label: 'Understanding request',
    description: 'Parse intent, target disease entity, and administrative boundary',
    status: 'pending',
    toolInvoked: 'parseIntent',
  },
  {
    id: 'step-02',
    label: 'Creating investigation plan',
    description: 'Assemble multi-source surveillance and diagnostic workflow',
    status: 'pending',
    toolInvoked: 'planInvestigation',
  },
  {
    id: 'step-03',
    label: 'Checking surveillance trends',
    description: 'Query weekly case notifications and reporting coverage',
    status: 'pending',
    toolInvoked: 'getDiseaseCases',
  },
  {
    id: 'step-04',
    label: 'Comparing historical baseline',
    description: 'Evaluate current observations against the available historical baseline',
    status: 'pending',
    toolInvoked: 'getDiseaseTrends',
  },
  {
    id: 'step-05',
    label: 'Checking LGA signals',
    description: 'Identify administrative clustering across affected local councils',
    status: 'pending',
    toolInvoked: 'getLGAStatistics',
  },
  {
    id: 'step-06',
    label: 'Checking hospital signals',
    description: 'Inspect secondary referral facilities for syndrome admission signals',
    status: 'pending',
    toolInvoked: 'getHospitalSignals',
  },
  {
    id: 'step-07',
    label: 'Checking laboratory signals',
    description: 'Retrieve available laboratory confirmation and positivity signals',
    status: 'pending',
    toolInvoked: 'getLaboratorySignals',
  },
  {
    id: 'step-08',
    label: 'Checking environmental signals',
    description: 'Review available environmental and meteorological indicators',
    status: 'pending',
    toolInvoked: 'getEnvironmentalSignals',
  },
  {
    id: 'step-09',
    label: 'Running anomaly detection',
    description: 'Execute deterministic statistical anomaly detection',
    status: 'pending',
    toolInvoked: 'detectAnomaly',
  },
  {
    id: 'step-10',
    label: 'Running forecast',
    description: 'Generate a 14-day deterministic trend projection with uncertainty',
    status: 'pending',
    toolInvoked: 'forecastDiseaseRisk',
  },
  {
    id: 'step-11',
    label: 'Retrieving epidemiological guidance',
    description: 'Retrieve disease-specific epidemiological guidance',
    status: 'pending',
    toolInvoked: 'searchGuidelines',
  },
  {
    id: 'step-12',
    label: 'Generating investigation brief',
    description: 'Fuse multi-source evidence, compute uncertainty, and draft brief',
    status: 'pending',
    toolInvoked: 'generateInvestigationReport',
  },
];

export class AgentService {
  /**
   * Parse user prompt to identify disease and geography.
   */
  public static parseUserPrompt(
    prompt: string
  ): { disease: DiseaseType; geography: string } {
    const lower = prompt.toLowerCase();

    let disease: DiseaseType = 'Cholera';

    if (lower.includes('lassa')) {
      disease = 'Lassa fever';
    } else if (lower.includes('dengue')) {
      disease = 'Dengue';
    }

    // Geography is resolved from the national/state catalogue. If the prompt
    // does not specify a geography, keep the scope explicit rather than
    // silently defaulting to a state with synthetic data.
    const geography = resolveStateGeography(lower) ?? 'Nigeria';

    return { disease, geography };
  }

  /**
   * Safely convert an unknown value to a number.
   */
  private static numberValue(
    value: unknown,
    fallback = 0
  ): number {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : fallback;
  }

  /**
   * Safely convert an unknown value to a string.
   */
  private static stringValue(
    value: unknown,
    fallback = 'Data unavailable'
  ): string {
    if (typeof value === 'string' && value.trim()) {
      return value;
    }

    return fallback;
  }

  /**
   * Convert a value to a readable percentage.
   */
  private static formatPercent(value: number): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  }

  /**
   * Build disease-specific recommendations without inventing numerical evidence.
   */
  private static buildRecommendations(
    disease: DiseaseType,
    geography: string,
    lgaStats: unknown
  ): RecommendationAction[] {
    const lgas = Array.isArray(lgaStats)
      ? lgaStats
      : [];

    const topAreas = lgas
      .slice(0, 3)
      .map((item: any) => item?.lga)
      .filter(Boolean)
      .join(', ');

    const geographicTarget =
      topAreas || `priority LGAs within ${geography}`;

    if (disease === 'Cholera') {
      return [
        {
          id: 'rec-01',
          order: 1,
          action: `Review case records and line lists from priority areas: ${geographicTarget}`,
          owner: 'State Epidemiologist & LGA Disease Surveillance Officers',
          urgency: 'HIGH',
          operationalNote:
            'Verify patient residence, onset date, reporting date, and completeness of case records.',
        },
        {
          id: 'rec-02',
          order: 2,
          action: 'Verify available laboratory confirmations and specimen records',
          owner: 'Public Health Laboratory Team',
          urgency: 'HIGH',
          operationalNote:
            'Confirm specimen status, collection dates, testing method, and laboratory reporting completeness.',
        },
        {
          id: 'rec-03',
          order: 3,
          action: `Audit surveillance reporting completeness across ${geography}`,
          owner: 'Surveillance Monitoring & Evaluation Team',
          urgency: 'MEDIUM',
          operationalNote:
            'Check missing reports, zero reporting, delayed submissions, and facility coverage.',
        },
        {
          id: 'rec-04',
          order: 4,
          action: 'Review water, sanitation, hygiene, and environmental conditions around priority signal areas',
          owner: 'WASH & Environmental Health Response Team',
          urgency: 'HIGH',
          operationalNote:
            'Use field verification to determine whether environmental conditions plausibly contribute to the observed signal.',
        },
        {
          id: 'rec-05',
          order: 5,
          action: 'Determine whether the signal is sustained or represents a localized cluster',
          owner: 'State Public Health Emergency Operations Team',
          urgency: 'HIGH',
          operationalNote:
            'Continue structured surveillance and reassess the signal as new observations become available.',
        },
      ];
    }

    if (disease === 'Lassa fever') {
      return [
        {
          id: 'rec-01',
          order: 1,
          action: `Review suspected and confirmed case line lists from priority areas: ${geographicTarget}`,
          owner: 'State Epidemiologist & LGA Disease Surveillance Officers',
          urgency: 'HIGH',
          operationalNote:
            'Verify symptom onset, residence, exposure history, reporting dates, and case classification.',
        },
        {
          id: 'rec-02',
          order: 2,
          action: 'Verify laboratory testing and specimen records for suspected cases',
          owner: 'Public Health Laboratory Team',
          urgency: 'HIGH',
          operationalNote:
            'Review specimen collection, testing status, turnaround time, and confirmation records.',
        },
        {
          id: 'rec-03',
          order: 3,
          action: `Review hospital syndromic signals and reporting completeness across ${geography}`,
          owner: 'Surveillance & Hospital Coordination Team',
          urgency: 'MEDIUM',
          operationalNote:
            'Compare reported signals across facilities and identify potential reporting gaps.',
        },
        {
          id: 'rec-04',
          order: 4,
          action: 'Review relevant environmental and community exposure indicators',
          owner: 'Environmental Health & Field Investigation Team',
          urgency: 'MEDIUM',
          operationalNote:
            'Use field investigation to determine whether contextual environmental signals are epidemiologically relevant.',
        },
        {
          id: 'rec-05',
          order: 5,
          action: 'Determine whether the observed increase is sustained and requires expanded investigation',
          owner: 'State Public Health Emergency Operations Team',
          urgency: 'HIGH',
          operationalNote:
            'Continue surveillance and update the assessment as additional laboratory and facility data arrive.',
        },
      ];
    }

    return [
      {
        id: 'rec-01',
        order: 1,
        action: `Review case line lists from priority areas in ${geography}`,
        owner: 'State Epidemiologist & LGA Surveillance Officers',
        urgency: 'HIGH',
        operationalNote:
          'Verify case classification, onset dates, residence, and reporting completeness.',
      },
      {
        id: 'rec-02',
        order: 2,
        action: 'Verify available laboratory evidence and testing records',
        owner: 'Public Health Laboratory Team',
        urgency: 'HIGH',
        operationalNote:
          'Cross-check available specimens, results, and reporting dates.',
      },
      {
        id: 'rec-03',
        order: 3,
        action: `Audit surveillance reporting completeness across ${geography}`,
        owner: 'Surveillance Monitoring & Evaluation Team',
        urgency: 'MEDIUM',
        operationalNote:
          'Identify missing facilities, delayed reports, and potential under-reporting.',
      },
      {
        id: 'rec-04',
        order: 4,
        action: 'Review relevant environmental and hospital signals',
        owner: 'Field Investigation Team',
        urgency: 'MEDIUM',
        operationalNote:
          'Determine whether secondary signals support further epidemiological investigation.',
      },
      {
        id: 'rec-05',
        order: 5,
        action: 'Determine whether the signal is sustained or localized',
        owner: 'State Public Health Emergency Operations Team',
        urgency: 'HIGH',
        operationalNote:
          'Continue structured monitoring and update the assessment as new observations arrive.',
      },
    ];
  }

  /**
   * Executes a step-by-step observable investigation with callbacks for UI updates.
   */
  public static async executeInvestigation(
    userPrompt: string,
    onProgress: (state: Partial<AgentExecutionState>) => void
  ): Promise<AgentExecutionState> {
    const { disease, geography } =
      this.parseUserPrompt(userPrompt);

    const runId =
      `run-${Date.now().toString(36)}`;

    const investigationId =
      `INV-2026-NGA-${Math.floor(1000 + Math.random() * 9000)}`;

    const steps: InvestigationStep[] =
      INITIAL_INVESTIGATION_STEPS.map((step) => ({
        ...step,
        status: 'pending',
      }));

    const toolsExecuted: ToolExecution[] = [];

    const scenarioLookup =
      getEpidemiologyDataProvider(ACTIVE_DATA_MODE).getScenario(disease, geography);
    const scenario = scenarioLookup.scenario;

    let currentState: AgentExecutionState = {
      isInvestigating: true,
      activeStepId: steps[0].id,
      steps: [...steps],
      toolsExecuted: [],
      evidence: [],
      anomaly: null,
      forecast: null,
      riskAssessment: null,
      uncertainty: null,
      aiInterpretation: null,
      recommendations: [],
      trace: null,
      activeDisease: disease,
      activeGeography: geography,
      dataAvailabilityStatus: 'not_checked',
      dataAvailabilityMessage: null,
    };

    onProgress(currentState);

    const advanceStep = async (
      stepIndex: number,
      toolExec: ToolExecution | null,
      extraUpdates: Partial<AgentExecutionState> = {}
    ) => {
      if (stepIndex > 0) {
        steps[stepIndex - 1].status = 'completed';
        steps[stepIndex - 1].completedAt =
          new Date().toISOString();
      }

      steps[stepIndex].status = 'running';
      steps[stepIndex].startedAt =
        new Date().toISOString();

      if (toolExec) {
        toolsExecuted.push(toolExec);
      }

      currentState = {
        ...currentState,
        activeStepId: steps[stepIndex].id,
        steps: [...steps],
        toolsExecuted: [...toolsExecuted],
        ...extraUpdates,
      };

      onProgress(currentState);

      await new Promise((resolve) =>
        setTimeout(resolve, 120)
      );
    };

    // Step 0: Understand request
    await advanceStep(0, null);

    // Step 1: Create plan
    await advanceStep(1, null);

    // Validate scenario availability before running disease-specific tools.
    // POPU must never substitute another geography's data.
    if (!scenario) {
      for (let i = 2; i < steps.length; i += 1) {
        steps[i].status = 'failed';
        steps[i].summary = 'Data unavailable for the requested disease and geography.';
        steps[i].completedAt = new Date().toISOString();
      }

      currentState = {
        ...currentState,
        isInvestigating: false,
        activeStepId: null,
        steps: [...steps],
        toolsExecuted: [],
        evidence: [],
        anomaly: null,
        forecast: null,
        riskAssessment: null,
        uncertainty: {
          dataCompletenessScore: 0,
          missingDataItems: [
            `${disease} data for ${geography}`,
          ],
          predictionIntervalDescription: 'No model output generated because the requested synthetic scenario is unavailable.',
          modelLimitations: ['No disease/geography scenario is configured for this demonstration.'],
          assumptions: [],
          coverageLimitations: ['The current demonstration data provider does not cover this disease and geography combination.'],
        },
        aiInterpretation: {
          whatSystemFound: 'No configured epidemiological data source was found for the requested disease and geography.',
          supportingSignals: [],
          interpretation: `POPU cannot investigate ${disease} in ${geography} using the current synthetic demonstration provider. No substitute geography was used.`,
          disclaimer: 'DATA UNAVAILABLE. This is not evidence that the disease signal is absent in the requested geography.',
        },
        recommendations: [],
        dataAvailabilityStatus: 'unavailable',
        dataAvailabilityMessage: `Data unavailable for ${disease} in ${geography}. POPU did not substitute another geography or generate unsupported epidemiological observations.`,
      };

      onProgress(currentState);
      return currentState;
    }

    currentState = {
      ...currentState,
      dataAvailabilityStatus: 'available',
      dataAvailabilityMessage: `Synthetic scenario available for ${disease} in ${geography}.`,
    };
    onProgress(currentState);

    // Step 2: Surveillance Cases
    const cases =
      await SurveillanceService.getDiseaseCases(
        disease,
        geography
      );

    await advanceStep(2, {
      id: `tool-${Date.now()}-1`,
      name: 'getDiseaseCases',
      description:
        'Fetch aggregate incidence data from the surveillance adapter',
      status: 'completed',
      inputs: {
        disease,
        geography,
        timeframe: 'Latest synthetic observation',
      },
      outputs: cases,
      executionTimeMs: 42,
      dataSource:
        'Integrated Disease Surveillance Adapter',
      dataStatus: 'synthetic',
    });

    // Step 3: Historical Baseline
    const trends =
      await SurveillanceService.getDiseaseTrends(
        disease,
        geography
      );

    await advanceStep(3, {
      id: `tool-${Date.now()}-2`,
      name: 'getDiseaseTrends',
      description:
        'Calculate historical baseline comparison',
      status: 'completed',
      inputs: {
        disease,
        geography,
        lookbackWeeks: 12,
      },
      outputs: trends,
      executionTimeMs: 38,
      dataSource:
        'Historical Epidemiological Reference Store',
      dataStatus: 'synthetic',
    });

    // Step 4: LGA Statistics
    const lgaStats =
      await SurveillanceService.getLGAStatistics(
        disease,
        geography
      );

    await advanceStep(4, {
      id: `tool-${Date.now()}-3`,
      name: 'getLGAStatistics',
      description:
        'Retrieve local government area case distribution',
      status: 'completed',
      inputs: {
        disease,
        geography,
      },
      outputs: lgaStats,
      executionTimeMs: 45,
      dataSource:
        'Synthetic Sub-National GIS Aggregator',
      dataStatus: 'synthetic',
    });

    // Step 5: Hospital Signals
    const hospital =
      await SurveillanceService.getHospitalSignals(
        disease,
        geography
      );

    await advanceStep(5, {
      id: `tool-${Date.now()}-4`,
      name: 'getHospitalSignals',
      description:
        'Query secondary sentinel hospital admission signals',
      status: 'completed',
      inputs: {
        disease,
        geography,
      },
      outputs: hospital,
      executionTimeMs: 51,
      dataSource:
        'Sentinel Referral Hospital EHR Gateways',
      dataStatus: 'synthetic',
    });

    // Step 6: Laboratory Signals
    const lab =
      await SurveillanceService.getLaboratorySignals(
        disease,
        geography
      );

    await advanceStep(6, {
      id: `tool-${Date.now()}-5`,
      name: 'getLaboratorySignals',
      description:
        'Fetch available laboratory confirmation signals',
      status: 'completed',
      inputs: {
        disease,
        geography,
      },
      outputs: lab,
      executionTimeMs: 64,
      dataSource:
        'Synthetic Public Health Laboratory Adapter',
      dataStatus: 'synthetic',
    });

    // Step 7: Environmental Signals
    const env =
      await SurveillanceService.getEnvironmentalSignals(
        disease,
        geography
      );

    await advanceStep(7, {
      id: `tool-${Date.now()}-6`,
      name: 'getEnvironmentalSignals',
      description:
        'Retrieve available environmental indicators',
      status: 'completed',
      inputs: {
        disease,
        geography,
      },
      outputs: env,
      executionTimeMs: 58,
      dataSource:
        'Synthetic Hydro-Meteorological Adapter',
      dataStatus: 'synthetic',
    });

    // Step 8: Anomaly Detection
    const anomalyResult =
      AnomalyService.detectAnomaly({
        disease,
        geography,
        method: 'Z-score',
      });

    await advanceStep(
      8,
      {
        id: `tool-${Date.now()}-7`,
        name: 'detectAnomaly',
        description:
          'Execute deterministic statistical anomaly detection',
        status: 'completed',
        inputs: {
          disease,
          geography,
          method: 'Z-score',
          threshold: 2.0,
        },
        outputs: {
          observed:
            anomalyResult.observedValue,
          baseline:
            anomalyResult.expectedBaseline,
          deviationPercent:
            anomalyResult.deviationPercent,
          zScore:
            anomalyResult.zScore,
          signalStatus:
            anomalyResult.status,
        },
        executionTimeMs: 29,
        dataSource:
          'POPU Deterministic Statistical Anomaly Engine',
        dataStatus: 'synthetic',
      },
      {
        anomaly: anomalyResult,
      }
    );

    // Step 9: Forecast
    const forecastResult =
      ForecastingService.forecastDiseaseRisk({
        disease,
        geography,
        horizonDays: 14,
      });

    await advanceStep(
      9,
      {
        id: `tool-${Date.now()}-8`,
        name: 'forecastDiseaseRisk',
        description:
          'Generate a 14-day deterministic trend projection with uncertainty',
        status: 'completed',
        inputs: {
          disease,
          geography,
          horizonDays: 14,
        },
        outputs: {
          model: forecastResult.modelName,
          modelVersion:
            forecastResult.modelVersion,
          riskScore:
            forecastResult.riskScore,
          trend:
            forecastResult.trend,
          expectedWeeklyTotal:
            forecastResult.expectedWeeklyTotal,
        },
        executionTimeMs: 33,
        dataSource:
          'POPU Deterministic Trend Projection Engine',
        dataStatus: 'synthetic',
      },
      {
        forecast: forecastResult,
      }
    );

    // Step 10: Guidelines Search
    const guidelines =
      SurveillanceService.searchGuidelines(
        disease
      );

    await advanceStep(10, {
      id: `tool-${Date.now()}-9`,
      name: 'searchGuidelines',
      description:
        'Retrieve disease-specific epidemiological guidance',
      status: 'completed',
      inputs: {
        disease,
        geography,
      },
      outputs: guidelines,
      executionTimeMs: 22,
      dataSource:
        'Synthetic Epidemiological Guidance Adapter',
      dataStatus: 'synthetic',
    });

    // Step 11: Final Synthesis
    const evidenceList =
      SurveillanceService.getEvidenceBundle(
        disease,
        geography
      );

    /*
     * IMPORTANT:
     * The final synthesis below is generated from the selected
     * scenario and the actual deterministic engine outputs.
     *
     * It is derived from the active scenario and deterministic engine outputs.
     */

    const observed =
      anomalyResult.observedValue;

    const baseline =
      anomalyResult.expectedBaseline;

    const deviation =
      anomalyResult.deviationPercent;

    const zScore =
      anomalyResult.zScore;

    const forecastRisk =
      forecastResult.riskScore;

    const reportingCompleteness =
      scenario?.reportingCompleteness ?? 0;

    const signalDetected =
      anomalyResult.status ===
        'Elevated Signal Detected' ||
      anomalyResult.status ===
        'Sub-threshold Variation';

    const signalStatus: RiskAssessment['signalStatus'] =
      anomalyResult.status ===
      'Elevated Signal Detected'
        ? 'Elevated signal'
        : anomalyResult.status ===
            'Within Expected Baseline'
          ? 'Baseline monitoring'
          : 'Baseline monitoring';

    const investigationStatus: RiskAssessment['investigationStatus'] =
      signalDetected
        ? 'Requires investigation'
        : 'Investigation in progress';

    const riskAssessment: RiskAssessment = {
      signalTitle:
        signalDetected
          ? `ELEVATED ${disease.toUpperCase()} SIGNAL`
          : `${disease.toUpperCase()} SIGNAL UNDER MONITORING`,
      disease,
      geography,
      forecastHorizon: '14 days',
      signalStatus,
      investigationStatus,
      humanReviewRequired: true,
      rationale:
        signalDetected
          ? `The latest synthetic surveillance observation is ${observed} cases compared with a calculated baseline of ${baseline.toFixed(1)} cases (${this.formatPercent(deviation)}; Z-score ${zScore.toFixed(2)}). The deterministic forecast projects a ${forecastResult.trend.replace('_', ' ')} trajectory over the next 14 days with a model-derived risk score of ${forecastRisk.toFixed(1)}/100. Additional hospital, laboratory, environmental, and geographic evidence is reviewed below.`
          : `The latest synthetic surveillance observation is ${observed} cases compared with a calculated baseline of ${baseline.toFixed(1)} cases (${this.formatPercent(deviation)}; Z-score ${zScore.toFixed(2)}). Current observations do not meet the configured anomaly threshold. The signal remains subject to continued monitoring and human review.`,
    };

    const missingDataItems: string[] = [];

    if (reportingCompleteness < 90) {
      missingDataItems.push(
        `Reporting completeness is ${reportingCompleteness.toFixed(1)}%; incomplete facility reporting may affect the observed signal.`
      );
    }

    if (!scenario) {
      missingDataItems.push(
        `No synthetic scenario is available for ${disease} in ${geography}.`
      );
    }

    if (missingDataItems.length === 0) {
      missingDataItems.push(
        'No additional synthetic missing-data item was identified by the current scenario.'
      );
    }

    const uncertaintyScore = Math.max(
      0,
      Math.min(100, reportingCompleteness)
    );

    const uncertainty: UncertaintyAnalysis = {
      dataCompletenessScore:
        Number(uncertaintyScore.toFixed(1)),

      missingDataItems,

      predictionIntervalDescription:
        forecastResult.predictionInterval,

      modelLimitations: [
        'The current frontend forecast is a deterministic trend projection, not a validated transmission model.',
        'Synthetic demonstration data cannot establish real-world disease incidence or outbreak probability.',
        'Forecast uncertainty increases when reporting completeness and source coverage are limited.',
      ],

      assumptions: [
        'Recent observed trends are sufficiently informative for the deterministic projection.',
        'The synthetic scenario represents a demonstration of the POPU investigation workflow.',
      ],

      coverageLimitations: [
        `Current demonstration coverage is limited to the configured synthetic scenario for ${disease} in ${geography}.`,
        'Production deployment will require validated surveillance, laboratory, hospital, environmental, and other approved data adapters.',
      ],
    };

    /*
     * Build supporting signals from evidence rather than
     * inventing a fixed disease/geography narrative.
     */

    const supportingSignals =
      evidenceList.slice(0, 5).map(
        (item) => ({
          category: item.category,
          signal:
            `${item.metric}: ${item.value}`,
          details:
            item.baselineComparison ||
            `${item.status} signal from ${item.source}.`,
        })
      );

    if (supportingSignals.length === 0) {
  supportingSignals.push({
    category: 'SURVEILLANCE',
    signal: 'Data unavailable',
    details:
      `No evidence bundle is currently available for ${disease} in ${geography}.`,
  });
}

    const aiInterpretation: AIInterpretation = {
      whatSystemFound:
        signalDetected
          ? `The synthetic surveillance series for ${disease} in ${geography} shows the latest observation at ${observed} cases against a calculated baseline of ${baseline.toFixed(1)} cases. The statistical engine returned a Z-score of ${zScore.toFixed(2)} and classified the latest observation as an elevated signal.`
          : `The synthetic surveillance series for ${disease} in ${geography} currently remains within the configured statistical baseline. The latest observation is ${observed} cases against a calculated baseline of ${baseline.toFixed(1)} cases.`,

      supportingSignals,

      interpretation:
        signalDetected
          ? `The available synthetic evidence is consistent with a signal requiring structured epidemiological investigation. The forecast indicates a ${forecastResult.trend.replace('_', ' ')} trajectory, but the model output should not be interpreted as a probability of outbreak or as confirmation of transmission.`
          : `The available synthetic evidence does not currently establish an elevated statistical signal. Continued monitoring is appropriate because future observations may change the assessment.`,

      disclaimer:
        `${SYNTHETIC_DEMO_TAG}. This is an AI interpretation of synthetic demonstration data. Human review and field verification by appropriate public-health authorities are required before operational action.`,
    };

    const recommendations =
      this.buildRecommendations(
        disease,
        geography,
        lgaStats
      );

    const dataSourcesQueried = [
      'Integrated Disease Surveillance Adapter',
      'Historical Epidemiological Reference Store',
      'Synthetic Sub-National GIS Aggregator',
      'Sentinel Referral Hospital EHR Gateways',
      'Synthetic Public Health Laboratory Adapter',
      'Synthetic Hydro-Meteorological Adapter',
      'POPU Deterministic Statistical Anomaly Engine',
      'POPU Deterministic Trend Projection Engine',
      'Synthetic Epidemiological Guidance Adapter',
    ];

    const trace: InvestigationTrace = {
      investigationId,
      agentRunId: runId,
      timestamp: new Date().toISOString(),
      userRequest: userPrompt,

      intentIdentified:
        `Signal Investigation [Disease: ${disease}, Geography: ${geography}]`,

      toolCallsExecuted: toolsExecuted,

      dataSourcesQueried,

      anomalyEngine:
        'POPU Deterministic Statistical Anomaly Suite (Z-score / EWMA / CUSUM)',

      forecastEngine:
        `${forecastResult.modelName} ${forecastResult.modelVersion}`,

      evidenceItemsCount:
        evidenceList.length,

      aiInterpretationHash:
        `sha256-${Math.random()
          .toString(36)
          .substring(2, 10)}`,

      humanReviewStatus:
        'Pending Human Verification',

      syntheticDataNotice:
        'SYNTHETIC DEMONSTRATION DATA - NOT FOR OFFICIAL CLINICAL ACTION',
    };

    steps[11].status = 'completed';
    steps[11].completedAt =
      new Date().toISOString();

    const finalState: AgentExecutionState = {
      isInvestigating: false,
      activeStepId: null,
      steps: [...steps],
      toolsExecuted: [...toolsExecuted],
      evidence: evidenceList,
      anomaly: anomalyResult,
      forecast: forecastResult,
      riskAssessment,
      uncertainty,
      aiInterpretation,
      recommendations,
      trace,
      activeDisease: disease,
      activeGeography: geography,
      dataAvailabilityStatus: 'available',
      dataAvailabilityMessage: `Synthetic scenario available for ${disease} in ${geography}.`,
    };

    onProgress(finalState);

    return finalState;
  }
}