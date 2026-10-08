export type SignalResult = {
  signal_id: string;
  disease: string;
  geography: string;
  status: 'ANOMALY' | 'ELEVATED';
  severity: 'HIGH' | 'MODERATE';
  detected_at: string;
  baseline_value: number;
  observed_value: number;
  percent_deviation: number;
  detection_method: string;
  source: string;
  summary: string;
  supporting_sources: string[];
  elevated_source_count: number;
  moderate_source_count: number;
  geographic_signal_count: number;
  data_status: string;
  notice: string;
  human_review_required: boolean;
  uncertainty: string[];
};

const API_BASE_URL =
  `${import.meta.env.VITE_POPU_API_BASE_URL ?? 'http://127.0.0.1:8000'}/api/v1`;

export async function fetchSignals(): Promise<SignalResult[]> {
  const response = await fetch(
    `${API_BASE_URL}/signals/scan`,
  );

  if (!response.ok) {
    throw new Error(
      `Signal request failed with status ${response.status}`,
    );
  }

  return response.json();
}