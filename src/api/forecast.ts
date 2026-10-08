export type ForecastResult = {
  disease: string;
  geography: string;
  forecast_horizon_days: number;
  predicted_values: number[];
  risk_level: 'LOW' | 'MODERATE' | 'ELEVATED';
  risk_score: number;
  confidence_interval: Array<{
    lower: number;
    upper: number;
  }>;
  model: string;
  model_version: string;
  data_status: string;
  notice: string;
  uncertainty: string[];
  human_review_required: boolean;
};

const API_BASE_URL =
  `${import.meta.env.VITE_POPU_API_BASE_URL ?? 'http://127.0.0.1:8000'}/api/v1`;

export async function fetchForecast(
  disease: string,
  geography: string,
  horizonDays: number,
): Promise<ForecastResult> {
  const params = new URLSearchParams({
    disease,
    geography,
    horizon_days: String(horizonDays),
  });

  const response = await fetch(
    `${API_BASE_URL}/analysis/forecast?${params.toString()}`,
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `Forecast request failed with status ${response.status}: ${detail}`,
    );
  }

  return response.json();
}