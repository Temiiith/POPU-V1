const POPU_API_BASE_URL =
  import.meta.env.VITE_POPU_API_BASE_URL ?? 'http://127.0.0.1:8000';
export interface BackendDataAvailabilityResponse {
  status: 'DATA_UNAVAILABLE' | 'SOURCE_NOT_CONFIGURED' | 'INVALID_GEOGRAPHY';
  disease: string;
  geography: string;
  provider: string;
  message: string;
  notice: string;
}

export interface BackendLLMInterpretation {
  provider: string;
  model: string;
  fallback_used: boolean;
  interpretation: string;
  uncertainty: string[];
  human_review_required: boolean;
}

export interface BackendInvestigationResult {
  disease: string;
  geography: string;

  anomaly: {
    status: 'NORMAL' | 'ELEVATED' | 'ANOMALY';
    disease: string;
    geography: string;
    data_status: string;
    notice: string;
    baseline_value: number;
    observed_value: number;
    absolute_deviation: number;
    percent_deviation: number;
    threshold_percent: number;
    method: string;
    model_output: string;
    uncertainty: string[];
    human_review_required: boolean;
  };

  evidence: {
    disease: string;
    geography: string;
    data_status: string;
    notice: string;
    evidence: {
      source: string;
      signal: 'STABLE' | 'MODERATE' | 'ELEVATED' | 'UNKNOWN';
      summary: string;
      observed_value: string | null;
      data_status: string;
      interpretation_type: string;
      uncertainty: string[];
    }[];
    geographic_evidence: {
      geography: string;
      cases: number;
      baseline_cases: number;
      signal: 'STABLE' | 'MODERATE' | 'ELEVATED' | 'UNKNOWN';
      deviation_percent: number;
    }[];
    elevated_signal_count: number;
    moderate_signal_count: number;
    stable_signal_count: number;
    uncertainty: string[];
    human_review_required: boolean;
  };

  forecast: {
    disease: string;
    geography: string;
    forecast_horizon_days: number;
    predicted_values: number[];
    risk_level: 'LOW' | 'MODERATE' | 'ELEVATED';
    risk_score: number;
    confidence_interval: {
      lower: number;
      upper: number;
    }[];
    model: string;
    model_version: string;
    data_status: string;
    notice: string;
    uncertainty: string[];
    human_review_required: boolean;
  };

  risk: {
    disease: string;
    geography: string;
    signal_status: string;
    risk_score: number;
    rationale: string;
    human_review_required: boolean;
  };

  integrated_risk: {
    disease: string;
    geography: string;
    risk_level: 'LOW' | 'MODERATE' | 'ELEVATED';
    risk_score: number;
    components: {
      name: string;
      signal: string;
      contribution: number;
      explanation: string;
    }[];
    key_factors: string[];
    data_status: string;
    notice: string;
    uncertainty: string[];
    human_review_required: boolean;
  };

  overall_signal: string;
  key_findings: string[];
  data_status: string;
  notice: string;
  uncertainty: string[];
  human_review_required: boolean;
}

export async function investigateWithBackend(
  request: string,
  forecastHorizonDays = 14,
): Promise<BackendInvestigationResult | BackendDataAvailabilityResponse> {
  const response = await fetch(
    `${POPU_API_BASE_URL}/api/v1/agent/investigate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        request,
        forecast_horizon_days: forecastHorizonDays,
      }),
    },
  );

  if (!response.ok) {
    let message = `POPU backend request failed with status ${response.status}.`;

    try {
      const errorBody = await response.json();

      if (typeof errorBody?.detail === 'string') {
        message = errorBody.detail;
      }
    } catch {
      // Keep the default HTTP error message.
    }

    throw new Error(message);
  }

  return (await response.json()) as
  | BackendInvestigationResult
  | BackendDataAvailabilityResponse;
}

export async function interpretWithBackend(
  request: string,
  forecastHorizonDays = 14,
): Promise<BackendLLMInterpretation> {
  const response = await fetch(
    `${POPU_API_BASE_URL}/api/v1/llm/interpret`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        request,
        forecast_horizon_days: forecastHorizonDays,
      }),
    },
  );

  if (!response.ok) {
    let message = `POPU LLM request failed with status ${response.status}.`;

    try {
      const errorBody = await response.json();

      if (typeof errorBody?.detail === 'string') {
        message = errorBody.detail;
      }
    } catch {
      // Keep the default HTTP error message.
    }

    throw new Error(message);
  }

  return response.json();
}
import { AnomalyService } from './anomalyService';

import type {
  AgentExecutionState,
  InvestigationStep,
} from './agentService';
import type {
  AnomalyResult,
  ForecastResult,
  EvidenceItem,
  RiskAssessment,
  UncertaintyAnalysis,
  AIInterpretation,
  RecommendationAction,
  InvestigationTrace,
} from '../types/agent';
function isDataAvailabilityResponse(
  result:
    | BackendInvestigationResult
    | BackendDataAvailabilityResponse,
): result is BackendDataAvailabilityResponse {
  return (
    'status' in result &&
    'message' in result &&
    'provider' in result &&
    !('anomaly' in result)
  );
}
export function mapBackendResultToAgentState(
  result: BackendInvestigationResult,
  request: string,
): AgentExecutionState {
    if (isDataAvailabilityResponse(result)) {
    return {
      isInvestigating: false,
      activeStepId: null,
      steps: [],
      toolsExecuted: [],
      evidence: [],
      anomaly: null,
      forecast: null,
      riskAssessment: null,
      uncertainty: {
        dataCompletenessScore: 0,
        missingDataItems: [result.message],
        predictionIntervalDescription: 'No forecast was generated.',
        modelLimitations: [result.notice],
        assumptions: [],
        coverageLimitations: [
          'No configured epidemiological data source is currently available for this disease and geography.',
        ],
      },
      aiInterpretation: {
        whatSystemFound: result.message,
        supportingSignals: [],
        interpretation: 'No investigation result was generated because the requested data coverage is not currently configured.',
        disclaimer: result.notice,
      },
      recommendations: [],
      trace: {
        investigationId: `availability-${Date.now()}`,
        agentRunId: `availability-run-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userRequest: request,
        intentIdentified: `Data availability check: ${result.disease} in ${result.geography}`,
        toolCallsExecuted: [],
        dataSourcesQueried: [],
        anomalyEngine: 'Not run',
        forecastEngine: 'Not run',
        evidenceItemsCount: 0,
        riskLevel: 'UNAVAILABLE',
        riskScore: 0,
        aiInterpretationHash: 'availability-check',
        humanReviewStatus: 'Data unavailable',
        syntheticDataNotice: result.notice,
      },
      activeDisease:
        result.disease === 'lassa_fever'
          ? 'Lassa fever'
          : result.disease === 'dengue'
            ? 'Dengue'
            : 'Cholera',
      activeGeography: result.geography,
      dataAvailabilityStatus: 'unavailable',
      dataAvailabilityMessage: result.message,
    };
  }
  const now = new Date().toISOString();

  const diseaseMap: Record<string, 'Cholera' | 'Dengue' | 'Lassa fever'> = {
    cholera: 'Cholera',
    dengue: 'Dengue',
    lassa_fever: 'Lassa fever',
  };

  const disease =
    diseaseMap[result.disease] ?? (result.disease as 'Cholera' | 'Dengue' | 'Lassa fever');

  const evidence: EvidenceItem[] = [
    ...result.evidence.evidence.map((item, index) => ({
      id: `backend-evidence-${index + 1}`,
      category:
        item.source.toLowerCase().includes('hospital')
          ? 'HOSPITAL'
          : item.source.toLowerCase().includes('laboratory')
            ? 'LABORATORY'
            : item.source.toLowerCase().includes('environment')
              ? 'ENVIRONMENT'
              : 'SURVEILLANCE',
      label: 'OBSERVED DATA',
      source: item.source,
      timestamp: now,
      geography: result.geography,
      dataType: item.data_status,
      metric: item.summary,
      value: item.observed_value ?? item.summary,
      baselineComparison: undefined,
      status:
        item.signal === 'ELEVATED'
          ? 'critical'
          : item.signal === 'MODERATE'
            ? 'elevated'
            : item.signal === 'STABLE'
              ? 'normal'
              : 'informational',
      isObservedOrDerived: 'observed',
      confidenceScore: item.signal === 'UNKNOWN' ? 0 : 75,
      syntheticTag: 'SYNTHETIC DEMONSTRATION DATA',
    })),
    ...result.evidence.geographic_evidence.map((item, index) => ({
      id: `backend-geographic-${index + 1}`,
      category: 'GEOGRAPHIC' as const,
      label: 'DERIVED STATISTIC' as const,
      source: 'POPU geographic evidence analysis',
      timestamp: now,
      geography: item.geography,
      dataType: result.data_status,
      metric: 'Cases vs baseline',
      value: item.cases,
      baselineComparison: `${item.deviation_percent}% deviation from baseline`,
      status:
        item.signal === 'ELEVATED'
          ? 'critical'
          : item.signal === 'MODERATE'
            ? 'elevated'
            : item.signal === 'STABLE'
              ? 'normal'
              : 'informational',
      isObservedOrDerived: 'derived' as const,
      confidenceScore: 75,
      syntheticTag: 'SYNTHETIC DEMONSTRATION DATA' as const,
    })),
  ];

  const anomaly: AnomalyResult = {
    disease,
    geography: result.geography,
    observedValue: result.anomaly.observed_value,
    expectedBaseline: result.anomaly.baseline_value,
    deviationPercent: result.anomaly.percent_deviation,
    zScore: result.anomaly.percent_deviation / 10,
    method: 'Rolling baseline',
    detectionDate: now,
    status:
      result.anomaly.status === 'ANOMALY'
        ? 'Elevated Signal Detected'
        : result.anomaly.status === 'ELEVATED'
          ? 'Sub-threshold Variation'
          : 'Within Expected Baseline',
    uncertainty: result.anomaly.uncertainty.join(' '),
    timeSeries: AnomalyService.detectAnomaly({
  disease,
  geography: result.geography,
  method: 'Rolling baseline',
}).timeSeries,
    dataStatus: 'SYNTHETIC DEMONSTRATION DATA',
    modelConfidence: 75,
  };

  const forecast: ForecastResult = {
    disease,
    geography: result.geography,
    forecastHorizonDays: result.forecast.forecast_horizon_days,
    predictedValues: result.forecast.predicted_values.map((value, index) => ({
      date: new Date(
        Date.now() + index * 24 * 60 * 60 * 1000,
      ).toISOString(),
      predicted: value,
      lowerBound: result.forecast.confidence_interval[index]?.lower,
      upperBound: result.forecast.confidence_interval[index]?.upper,
    })),
    predictionInterval: 'Model-provided confidence interval',
    riskScore: result.forecast.risk_score,
    modelName: result.forecast.model,
    modelVersion: result.forecast.model_version,
    generatedAt: now,
    trend:
      result.forecast.predicted_values.length > 1 &&
      result.forecast.predicted_values.at(-1)! >
        result.forecast.predicted_values[0]
        ? 'increasing'
        : 'stable',
    expectedWeeklyTotal: result.forecast.predicted_values
      .slice(0, 7)
      .reduce((sum, value) => sum + value, 0),
    dataStatus: 'SYNTHETIC DEMONSTRATION DATA',
  };

  const riskAssessment: RiskAssessment = {
    signalTitle: `${result.overall_signal.toUpperCase()} — ${disease.toUpperCase()} SIGNAL`,
    disease,
    geography: result.geography,
    forecastHorizon: `${result.forecast.forecastHorizonDays} days`,
    signalStatus:
      result.integrated_risk.risk_level === 'ELEVATED'
        ? 'Elevated signal'
        : 'Baseline monitoring',
    investigationStatus: 'Requires investigation',
    humanReviewRequired: true,
    rationale: result.key_findings.join(' '),
  };

  const uncertainty: UncertaintyAnalysis = {
    dataCompletenessScore: 100,
    missingDataItems: result.uncertainty,
    predictionIntervalDescription:
      'See backend forecast confidence interval.',
    modelLimitations: result.uncertainty,
    assumptions: [],
    coverageLimitations: [
      'Current results use the configured POPU demonstration data source.',
    ],
  };

  const aiInterpretation: AIInterpretation = {
    whatSystemFound: result.key_findings.join(' '),
    supportingSignals: result.integrated_risk.components
      .slice(0, 5)
      .map(component => ({
        category: component.name,
        signal: component.signal,
        details: component.explanation,
      })),
    interpretation:
      'The backend investigation engine synthesized the available evidence, anomaly analysis, forecast and integrated risk assessment.',
    disclaimer: result.notice,
  };

  const recommendations: RecommendationAction[] = [];

  const surveillanceEvidence = result.evidence.evidence.find(
    item => item.source.toLowerCase() === 'surveillance',
  );

  const hospitalEvidence = result.evidence.evidence.find(
    item => item.source.toLowerCase() === 'hospital',
  );

  const laboratoryEvidence = result.evidence.evidence.find(
    item => item.source.toLowerCase() === 'laboratory',
  );

  const environmentalEvidence = result.evidence.evidence.find(
    item => item.source.toLowerCase() === 'environmental',
  );

  const toolCallsExecuted = [
    {
      id: 'tool-disease-cases',
      name: 'getDiseaseCases',
      description: 'Retrieve observed disease case counts for the investigation geography.',
      status: 'completed' as const,
      inputs: {
        disease,
        geography: result.geography,
      },
      outputs: {
        observedValue: result.anomaly.observed_value,
        baselineValue: result.anomaly.baseline_value,
        absoluteDeviation: result.anomaly.absolute_deviation,
      },
      executionTimeMs: 0,
      dataSource: 'surveillance',
      dataStatus: 'synthetic' as const,
    },
    {
      id: 'tool-disease-trends',
      name: 'getDiseaseTrends',
      description: 'Review recent disease activity against the configured baseline.',
      status: 'completed' as const,
      inputs: {
        disease,
        geography: result.geography,
      },
      outputs: {
        signal: surveillanceEvidence?.signal ?? result.anomaly.status,
        summary:
          surveillanceEvidence?.summary ??
          'Surveillance trend evidence was used in the investigation.',
        deviationPercent: result.anomaly.percent_deviation,
      },
      executionTimeMs: 0,
      dataSource: 'surveillance',
      dataStatus: 'synthetic' as const,
    },
    {
      id: 'tool-hospital-signals',
      name: 'getHospitalSignals',
      description: 'Review hospital-related signals contributing to the investigation.',
      status: 'completed' as const,
      inputs: {
        disease,
        geography: result.geography,
      },
      outputs: {
        signal: hospitalEvidence?.signal ?? 'UNKNOWN',
        summary:
          hospitalEvidence?.summary ??
          'No hospital signal was available in the returned evidence.',
        observedValue: hospitalEvidence?.observed_value ?? null,
      },
      executionTimeMs: 0,
      dataSource: 'hospital',
      dataStatus: 'synthetic' as const,
    },
    {
      id: 'tool-laboratory-signals',
      name: 'getLaboratorySignals',
      description: 'Review laboratory signals contributing to the investigation.',
      status: 'completed' as const,
      inputs: {
        disease,
        geography: result.geography,
      },
      outputs: {
        signal: laboratoryEvidence?.signal ?? 'UNKNOWN',
        summary:
          laboratoryEvidence?.summary ??
          'No laboratory signal was available in the returned evidence.',
        observedValue: laboratoryEvidence?.observed_value ?? null,
      },
      executionTimeMs: 0,
      dataSource: 'laboratory',
      dataStatus: 'synthetic' as const,
    },
    {
      id: 'tool-environmental-signals',
      name: 'getEnvironmentalSignals',
      description: 'Review environmental signals contributing to the investigation.',
      status: 'completed' as const,
      inputs: {
        disease,
        geography: result.geography,
      },
      outputs: {
        signal: environmentalEvidence?.signal ?? 'UNKNOWN',
        summary:
          environmentalEvidence?.summary ??
          'No environmental signal was available in the returned evidence.',
        observedValue: environmentalEvidence?.observed_value ?? null,
      },
      executionTimeMs: 0,
      dataSource: 'environmental',
      dataStatus: 'synthetic' as const,
    },
    {
      id: 'tool-detect-anomaly',
      name: 'detectAnomaly',
      description: 'Detect deviations from the configured epidemiological baseline.',
      status: 'completed' as const,
      inputs: {
        disease,
        geography: result.geography,
      },
      outputs: {
        status: result.anomaly.status,
        baseline: result.anomaly.baseline_value,
        observed: result.anomaly.observed_value,
        absoluteDeviation: result.anomaly.absolute_deviation,
        percentDeviation: result.anomaly.percent_deviation,
        threshold: result.anomaly.threshold_percent,
        method: result.anomaly.method,
      },
      executionTimeMs: 0,
      dataSource: 'POPU anomaly engine',
      dataStatus: 'synthetic' as const,
    },
    {
      id: 'tool-forecast-risk',
      name: 'forecastDiseaseRisk',
      description: 'Generate the configured disease risk forecast.',
      status: 'completed' as const,
      inputs: {
        disease,
        geography: result.geography,
        forecastHorizonDays: result.forecast.forecastHorizonDays,
      },
      outputs: {
        riskLevel: result.forecast.risk_level,
        riskScore: result.forecast.risk_score,
        model: result.forecast.model,
        modelVersion: result.forecast.modelName,
        predictedValues: result.forecast.predicted_values,
      },
      executionTimeMs: 0,
      dataSource: 'POPU forecast engine',
      dataStatus: 'synthetic' as const,
    },
    {
      id: 'tool-integrated-risk',
      name: 'generateInvestigationReport',
      description: 'Combine evidence, anomaly, forecast and supporting signals into the investigation risk assessment.',
      status: 'completed' as const,
      inputs: {
        disease,
        geography: result.geography,
      },
      outputs: {
        riskLevel: result.integrated_risk.risk_level,
        riskScore: result.integrated_risk.risk_score,
        components: result.integrated_risk.components,
        keyFactors: result.integrated_risk.key_factors,
      },
      executionTimeMs: 0,
      dataSource: 'POPU integrated risk engine',
      dataStatus: 'synthetic' as const,
    },
  ];

  const trace: InvestigationTrace = {
    investigationId: `backend-${Date.now()}`,
    agentRunId: `backend-run-${Date.now()}`,
    timestamp: now,
    userRequest: request,
    intentIdentified: `Backend investigation: ${disease} in ${result.geography}`,
    toolCallsExecuted,
    dataSourcesQueried: result.evidence.evidence.map(item => item.source),
    anomalyEngine: result.anomaly.method,
    forecastEngine: `${result.forecast.model} ${result.forecast.modelName}`,
       evidenceItemsCount: evidence.length,
    riskLevel: result.integrated_risk.risk_level,
    riskScore: result.integrated_risk.risk_score,
    aiInterpretationHash: 'backend-generated',
    humanReviewStatus: 'Pending Human Verification',
    syntheticDataNotice:
      'SYNTHETIC DEMONSTRATION DATA - NOT FOR OFFICIAL CLINICAL ACTION',
  };

  const steps: InvestigationStep[] = [
    {
      id: 'understand-request',
      label: 'Understanding request',
      description: 'Interpret the epidemiological investigation request.',
      status: 'completed',
    },
    {
      id: 'investigation-analysis',
      label: 'Running backend investigation',
      description: 'POPU backend analyzes anomaly, evidence, forecast and integrated risk.',
      status: 'completed',
    },
    {
      id: 'evidence-review',
      label: 'Reviewing evidence',
      description: 'Combine available surveillance and supporting signals.',
      status: 'completed',
    },
    {
      id: 'forecast',
      label: 'Running forecast',
      description: 'Generate the configured forecast horizon.',
      status: 'completed',
    },
    {
      id: 'human-review',
      label: 'Human review required',
      description: 'Results require human verification before operational action.',
      status: 'completed',
    },
  ];

  return {
    isInvestigating: false,
    activeStepId: null,
    steps,
    toolsExecuted: [],
    evidence,
    anomaly,
    forecast,
    riskAssessment,
    uncertainty,
    aiInterpretation,
    recommendations,
    trace,
    activeDisease: disease,
    activeGeography: result.geography,
    dataAvailabilityStatus: 'available',
    dataAvailabilityMessage: null,
  };
}
