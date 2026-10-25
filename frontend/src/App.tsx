import { useState } from 'react';
import {
  FIELD_GROUPS,
  ALL_FIELDS,
  validateField,
  emptyValues,
  SAMPLE_STUDENT,
  AT_RISK_STUDENT,
  type FormValues,
  type FormErrors,
} from './fields';
import type { FieldKey, PredictionResult, StudentInput } from './types';
import Field from './Field';
import Results from './Results';
import { predictReadiness } from './api';

export default function App() {
  const [values, setValues] = useState<FormValues>(SAMPLE_STUDENT);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleFieldChange = (key: FieldKey, rawValue: string) => {
    setValues((prev) => ({ ...prev, [key]: rawValue }));

    // Revalidate if touched
    if (touched[key]) {
      const fieldConfig = ALL_FIELDS.find((f) => f.key === key);
      if (fieldConfig) {
        const error = validateField(fieldConfig, rawValue);
        setErrors((prev) => ({
          ...prev,
          [key]: error ?? undefined,
        }));
      }
    }
  };

  const handleFieldBlur = (key: FieldKey) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const fieldConfig = ALL_FIELDS.find((f) => f.key === key);
    if (fieldConfig) {
      const error = validateField(fieldConfig, values[key] ?? '');
      setErrors((prev) => ({
        ...prev,
        [key]: error ?? undefined,
      }));
    }
  };

  const handleLoadPreset = (preset: FormValues) => {
    setValues(preset);
    setErrors({});
    setTouched({});
    setApiError(null);
  };

  const handleReset = () => {
    setValues(emptyValues());
    setErrors({});
    setTouched({});
    setResult(null);
    setApiError(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    // Validate all fields
    const newErrors: FormErrors = {};
    const newTouched: Partial<Record<FieldKey, boolean>> = {};
    let hasError = false;

    for (const field of ALL_FIELDS) {
      newTouched[field.key] = true;
      const error = validateField(field, values[field.key] ?? '');
      if (error) {
        newErrors[field.key] = error;
        hasError = true;
      }
    }

    setTouched(newTouched);
    setErrors(newErrors);

    if (hasError) {
      setApiError('Please correct the highlighted inputs before predicting.');
      return;
    }

    setLoading(true);
    setApiError(null);

    // Build payload with all 12 numeric fields
    const payload = Object.fromEntries(
      ALL_FIELDS.map((field) => [field.key, Number(values[field.key])])
    ) as StudentInput;

    try {
      const prediction = await predictReadiness(payload);
      setResult(prediction);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred.';
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream text-charcoal flex flex-col justify-between selection:bg-sage-100">
      {/* Top Header */}
      <header className="border-b border-sand/80 bg-ivory/80 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-olive text-white shadow-sm">
              <span className="font-serif text-lg font-bold">SP</span>
            </div>
            <div>
              <h1 className="font-serif text-lg font-medium tracking-tight text-charcoal sm:text-xl">
                Student Pass/Fail Predictor
              </h1>
              <p className="text-[11px] text-charcoal-mute hidden sm:block">
                Logistic Regression Exam Readiness ML Model
              </p>
            </div>
          </div>

          {/* Quick presets & reset */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleLoadPreset(SAMPLE_STUDENT)}
              className="rounded-lg border border-sand bg-white px-2.5 py-1.5 text-xs font-medium text-charcoal-soft transition hover:border-sage-300 hover:text-charcoal"
              title="Fill form with typical passing student data"
            >
              Passing Sample
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset(AT_RISK_STUDENT)}
              className="rounded-lg border border-sand bg-white px-2.5 py-1.5 text-xs font-medium text-charcoal-soft transition hover:border-sage-300 hover:text-charcoal"
              title="Fill form with at-risk student data"
            >
              At-Risk Sample
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-charcoal-mute transition hover:text-charcoal"
              title="Clear all inputs"
            >
              Clear
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        {/* Intro Hero Section */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-sand bg-ivory px-3 py-1 text-xs font-medium text-charcoal-soft mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-olive animate-pulse" />
            Connected to FastAPI Endpoint:{' '}
            <code className="font-mono text-charcoal font-semibold">
              POST /predict
            </code>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-charcoal">
            Student Academic Outcome Estimator
          </h2>
          <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-charcoal-soft">
            Evaluate exam readiness based on 12 validated demographic, academic,
            support, and lifestyle parameters. The model outputs the computed
            pass probability and binary classification.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Form (7 cols on lg) */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {FIELD_GROUPS.map((group, groupIdx) => (
                <section
                  key={group.title}
                  className="rounded-3xl border border-sand bg-ivory p-6 sm:p-7 shadow-card"
                >
                  <div className="mb-5 flex items-baseline justify-between border-b border-sand/70 pb-3.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sage-100 text-[11px] font-bold text-olive-deep">
                          {groupIdx + 1}
                        </span>
                        <h3 className="font-serif text-xl font-medium tracking-tight text-charcoal">
                          {group.title}
                        </h3>
                      </div>
                      {group.description && (
                        <p className="mt-1 text-xs text-charcoal-mute">
                          {group.description}
                        </p>
                      )}
                    </div>
                    <span className="text-xs font-medium text-charcoal-mute">
                      {group.fields.length} {group.fields.length === 1 ? 'field' : 'fields'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {group.fields.map((field) => (
                      <Field
                        key={field.key}
                        config={field}
                        value={values[field.key] ?? ''}
                        error={touched[field.key] ? errors[field.key] : undefined}
                        onChange={(val) => handleFieldChange(field.key, val)}
                        onBlur={() => handleFieldBlur(field.key)}
                      />
                    ))}
                  </div>
                </section>
              ))}

              {/* Submit Action Card */}
              <div className="rounded-3xl border border-sand bg-ivory p-6 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-charcoal">
                    Ready to compute prediction?
                  </h4>
                  <p className="text-xs text-charcoal-mute mt-0.5">
                    All 12 inputs will be validated and dispatched to the ML backend.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-olive px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-olive-deep active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Computing…</span>
                    </>
                  ) : (
                    <>
                      <span>Predict Exam Outcome</span>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>

              {/* Form level error notification if any */}
              {apiError && !loading && (
                <div className="rounded-2xl border border-clay/40 bg-clay-soft/40 p-4 text-xs text-clay font-medium flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-clay text-[11px] font-bold text-white">
                    !
                  </span>
                  <span>{apiError}</span>
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Prediction Results (5 cols on lg) */}
          <div className="lg:col-span-5 lg:sticky lg:top-20">
            <Results
              result={result}
              loading={loading}
              error={apiError}
              onRetry={handleSubmit}
            />

            {/* Model Information Card */}
            <div className="mt-6 rounded-3xl border border-sand bg-ivory/60 p-5 text-xs text-charcoal-soft">
              <h4 className="font-serif text-sm font-semibold text-charcoal mb-2">
                About the Prediction Engine
              </h4>
              <p className="leading-relaxed">
                Trained on the Student Performance dataset using scikit-learn.
                Features are standardized via <code className="font-mono text-charcoal font-medium">StandardScaler</code> before
                computing the logistic sigmoid score:
              </p>
              <div className="my-2.5 rounded-xl border border-sand/70 bg-white/70 p-2.5 font-mono text-[11px] text-charcoal text-center">
                P(Pass) = 1 / (1 + e<sup>-(w · x + b)</sup>)
              </div>
              <ul className="mt-2 space-y-1 text-charcoal-mute list-disc list-inside">
                <li>12 numerical and binary features evaluated</li>
                <li>Decision boundary: Pass if probability ≥ 0.50</li>
                <li>Backend: FastAPI on localhost:8000</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-sand/80 bg-ivory/70 py-6 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-charcoal-mute">
          <p>© Student ML Project · Academic Outcome Predictor</p>
          <p className="flex items-center gap-2">
            <span>Palette: Cream · Charcoal · Sage · Olive</span>
            <span>•</span>
            <span>Zero Blue / Purple Guarantee</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
