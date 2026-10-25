import type { PredictionResult } from './types';
import Gauge from './Gauge';

interface Props {
  result: PredictionResult | null;
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export default function Results({ result, loading, error, onRetry }: Props) {
  return (
    <section
      aria-live="polite"
      className="rounded-3xl border border-sand bg-ivory p-6 sm:p-8 shadow-card"
    >
      <div className="flex items-center justify-between border-b border-sand/70 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-medium tracking-tight text-charcoal">
            Prediction Outcome
          </h2>
          <p className="mt-0.5 text-xs text-charcoal-mute">
            Live inference from logistic regression model
          </p>
        </div>
        {result && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase ${
              result.status === 'PASS'
                ? 'bg-sage-100 text-olive-deep ring-1 ring-sage-300'
                : 'bg-clay-soft text-clay ring-1 ring-clay/30'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                result.status === 'PASS' ? 'bg-olive' : 'bg-clay'
              }`}
            />
            {result.status}
          </span>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="relative mb-5 flex h-14 w-14 items-center justify-center">
            <div className="absolute h-full w-full animate-ping rounded-full bg-sage-300/40" />
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-sage-500 border-t-transparent" />
          </div>
          <h3 className="font-serif text-lg font-medium text-charcoal">
            Analyzing Student Profile
          </h3>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-charcoal-soft">
            Scaling features and computing logistic regression decision boundary…
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="mt-6 rounded-2xl border border-clay/40 bg-clay-soft/40 p-5 text-left">
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-clay text-xs font-bold text-white">
              !
            </span>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-charcoal">
                Prediction Request Failed
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-charcoal-soft">
                {error}
              </p>
              <p className="mt-2 text-[11px] text-charcoal-mute">
                Ensure the FastAPI backend is running at{' '}
                <code className="rounded bg-white/70 px-1 py-0.5 font-mono text-[11px] text-charcoal">
                  http://127.0.0.1:8000
                </code>
              </p>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-4 inline-flex items-center rounded-xl bg-charcoal px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-charcoal-soft active:scale-95"
                >
                  Retry Request
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {!loading && !error && !result && (
        <div className="flex flex-col items-center py-12 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sand/40 text-charcoal-mute">
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="font-serif text-lg font-medium text-charcoal">
            Awaiting Input
          </h3>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-charcoal-soft">
            Complete the 12 student indicators on the left and select{' '}
            <strong className="text-charcoal font-semibold">
              Predict Exam Outcome
            </strong>{' '}
            to view the model assessment.
          </p>
        </div>
      )}

      {!loading && !error && result && (
        <div className="mt-6 flex flex-col items-center">
          {/* Gauge with probability and pass marker */}
          <div className="w-full">
            <Gauge
              key={result.probability}
              probability={result.probability}
              pass={result.status === 'PASS'}
            />
          </div>

          <div className="mt-6 w-full rounded-2xl border border-sand/70 bg-white/80 p-5">
            <div className="flex items-center gap-3">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold ${
                  result.status === 'PASS'
                    ? 'bg-sage-100 text-olive-deep'
                    : 'bg-clay-soft text-clay'
                }`}
              >
                {result.status === 'PASS' ? '✓' : '✕'}
              </span>
              <div>
                <h4 className="text-sm font-semibold text-charcoal">
                  {result.status === 'PASS'
                    ? 'Likely to Pass Final Exam'
                    : 'Risk of Failing Final Exam'}
                </h4>
                <p className="text-xs text-charcoal-mute">
                  Probability threshold: 50.0%
                </p>
              </div>
            </div>

            <p className="mt-3.5 text-xs leading-relaxed text-charcoal-soft">
              {result.status === 'PASS'
                ? `The fitted logistic model projects an estimated ${(
                    result.probability * 100
                  ).toFixed(1)}% probability that this student clears the exam passing grade.`
                : `The fitted logistic model projects an estimated ${(
                    result.probability * 100
                  ).toFixed(1)}% probability, placing the student below the 50% passing threshold.`}
            </p>

            <div className="mt-4 border-t border-sand/60 pt-3">
              <div className="flex justify-between text-[11px] text-charcoal-mute font-medium">
                <span>Model: Logistic Regression</span>
                <span>Scaled via StandardScaler</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
