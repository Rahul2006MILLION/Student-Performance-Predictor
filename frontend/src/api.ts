import type { StudentInput, PredictionResult } from './types';

const API_BASE = (
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
).replace(/\/+$/, '');

/**
 * Sends student attributes to the FastAPI backend model endpoint.
 * POST http://127.0.0.1:8000/predict
 */
export async function predictReadiness(
  input: StudentInput
): Promise<PredictionResult> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(input),
    });
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : 'Network request failed';
    throw new Error(
      `Unable to connect to prediction server at ${API_BASE}. (${errorMsg})`,
      { cause: err }
    );
  }

  if (!response.ok) {
    let errorDetail = `HTTP ${response.status} ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (typeof errorJson?.detail === 'string') {
        errorDetail = errorJson.detail;
      } else if (errorJson?.detail) {
        errorDetail = JSON.stringify(errorJson.detail);
      }
    } catch {
      try {
        const text = await response.text();
        if (text) errorDetail = text;
      } catch {
        // Fall back to HTTP status
      }
    }
    throw new Error(`Prediction API error: ${errorDetail}`);
  }

  const data = (await response.json()) as PredictionResult;

  if (
    typeof data.probability !== 'number' ||
    (data.status !== 'PASS' && data.status !== 'FAIL')
  ) {
    throw new Error('Unexpected response format from prediction API.');
  }

  return data;
}
