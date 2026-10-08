/**
 * POPU AI Epidemiological Intelligence Agent
 * Core Type Definitions
 * 
 * Strict separation between deterministic epidemiological calculations
 * and agent orchestration metadata.
 */

export type DiseaseType = 'Cholera' | 'Dengue' | 'Lassa fever';

export type GeographicLevel = 'Country' | 'State' | 'LGA' | 'Health Facility';

export type StepStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface InvestigationStep {
  id: string;
  label: string;
  description: string;
  status: StepStatus;
  startedAt?: string;
  completedAt?: string;
  toolInvoked?: string;
  summary?: string;
}

export interface ToolExecution {
  id: string;
  name: 
    | 'getDiseaseCases'
    | 'getDiseaseTrends'
    | 'getLGAStatistics'
    | 'getHospitalSignals'
    | 'getLaboratorySignals'
    | 'getWeatherData'
    | 'getEnvironmentalSignals'
    | 'getMobilitySignals'
    | 'detectAnomaly'
    | 'forecastDiseaseRisk'
    | 'searchGuidelines'
    | 'generateInvestigationReport';
  description: string;
  status: StepStatus;
  inputs: Record<string, any>;
  outputs?: Record<string, any>;
  executionTimeMs: number;
  dataSource: string;
  dataStatus: 'synthetic' | 'production_pending';
  errorState?: string;
}

export type EvidenceCategory = 
  | 'SURVEILLANCE' 
  | 'HOSPITAL' 
  | 'LABORATORY' 
  | 'ENVIRONMENT' 
  | 'GEOGRAPHIC';

export type EvidenceLabel = 
  | 'OBSERVED DATA' 
  | 'DERIVED STATISTIC' 
  | 'MODEL OUTPUT' 
  | 'AI INTERPRETATION' 
  | 'RECOMMENDATION' 
  | 'UNCERTAINTY' 
  | 'ASSUMPTION';

export interface EvidenceItem {
  id: string;
  category: EvidenceCategory;
  label: EvidenceLabel;
  source: string;
  timestamp: string;
  geography: string;
  dataType: string;
  metric: string;
  value: string | number;
  baselineComparison?: string;
  status: 'normal' | 'elevated' | 'critical' | 'informational';
  isObservedOrDerived: 'observed' | 'derived' | 'modeled';
  confidenceScore: number;
  syntheticTag: 'SYNTHETIC DEMONSTRATION DATA';
}

export type AnomalyMethod = 
  | 'Rolling baseline' 
  | 'Seasonal baseline' 
  | 'Z-score' 
  | 'EWMA' 
  | 'CUSUM';

export interface AnomalyDataPoint {
  date: string;
  observed: number;
  baseline: number;
  upperThreshold: number;
  lowerThreshold?: number;
  isAnomaly: boolean;
}

export interface AnomalyResult {
  disease: DiseaseType;
  geography: string;
  observedValue: number;
  expectedBaseline: number;
  deviationPercent: number;
  zScore: number;
  method: AnomalyMethod;
  detectionDate: string;
  status: 'Elevated Signal Detected' | 'Within Expected Baseline' | 'Sub-threshold Variation';
  uncertainty: string;
  timeSeries: AnomalyDataPoint[];
  dataStatus: 'SYNTHETIC DEMONSTRATION DATA';
  modelConfidence: number;
}

export interface ForecastDataPoint {
  date: string;
  historical?: number;
  predicted?: number;
  lowerBound?: number;
  upperBound?: number;
}

export interface ForecastResult {
  disease: DiseaseType;
  geography: string;
  forecastHorizonDays: number;
  predictedValues: ForecastDataPoint[];
  predictionInterval: string; // e.g. "95% Prediction Interval"
  riskScore: number; // 0 - 100
  modelName: string;
  modelVersion: string;
  generatedAt: string;
  trend: 'rapidly_increasing' | 'increasing' | 'stable' | 'decreasing';
  expectedPeakDate?: string;
  expectedWeeklyTotal: number;
  dataStatus: 'SYNTHETIC DEMONSTRATION DATA';
}

export interface RiskAssessment {
  signalTitle: string; // e.g., "ELEVATED CHOLERA SIGNAL"
  disease: DiseaseType;
  geography: string;
  forecastHorizon: string;
  signalStatus: 'Elevated signal' | 'Baseline monitoring' | 'Critical anomaly';
  investigationStatus: 'Requires investigation' | 'Investigation in progress' | 'Resolved';
  humanReviewRequired: true;
  rationale: string;
}

export interface UncertaintyAnalysis {
  dataCompletenessScore: number; // percentage (e.g. 72%)
  missingDataItems: string[];
  predictionIntervalDescription: string;
  modelLimitations: string[];
  assumptions: string[];
  coverageLimitations: string[];
}

export interface AIInterpretation {
  whatSystemFound: string;
  supportingSignals: {
    category: string;
    signal: string;
    details: string;
  }[];
  interpretation: string;
  disclaimer: string;
}

export interface RecommendationAction {
  id: string;
  order: number;
  action: string;
  owner: string;
  urgency: 'HIGH' | 'MEDIUM' | 'ROUTINE';
  operationalNote: string;
}

export interface InvestigationTrace {
  investigationId: string;
  agentRunId: string;
  timestamp: string;
  userRequest: string;
  intentIdentified: string;
  toolCallsExecuted: ToolExecution[];
  dataSourcesQueried: string[];
  anomalyEngine: string;
  forecastEngine: string;
  evidenceItemsCount: number;
    riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED';
  riskScore: number;
  aiInterpretationHash: string;
  humanReviewStatus: 'Pending Human Verification' | 'Reviewed and Signed Off';
  syntheticDataNotice: 'SYNTHETIC DEMONSTRATION DATA - NOT FOR OFFICIAL CLINICAL ACTION';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  timestamp: string;
  text: string;
  isExecuting?: boolean;
  activeInvestigationId?: string;
}
