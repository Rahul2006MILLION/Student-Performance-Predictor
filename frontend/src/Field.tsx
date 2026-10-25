import type { FieldConfig } from './types';

interface Props {
  config: FieldConfig;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}

export default function Field({
  config,
  value,
  error,
  onChange,
  onBlur,
}: Props) {
  const id = `field-${config.key}`;
  const isSelect = Array.isArray(config.options) && config.options.length > 0;

  return (
    <div
      className={`flex flex-col justify-between rounded-2xl p-4 transition-all duration-200 border ${
        error
          ? 'border-clay/60 bg-clay-soft/20 shadow-sm'
          : 'border-sand/70 bg-ivory/80 hover:border-sage-300 hover:bg-white shadow-[0_2px_8px_rgba(43,42,39,0.03)]'
      }`}
    >
      <div>
        <div className="flex items-baseline justify-between gap-2">
          <label
            htmlFor={isSelect ? undefined : id}
            id={`${id}-label`}
            className="text-sm font-medium tracking-tight text-charcoal"
          >
            {config.label}
          </label>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-mute">
            {isSelect ? 'Choice' : `Range: ${config.min}–${config.max}`}
          </span>
        </div>

        <div className="mt-2.5">
          {isSelect ? (
            <div
              role="radiogroup"
              aria-labelledby={`${id}-label`}
              className="grid grid-cols-2 gap-2"
            >
              {config.options!.map((opt) => {
                const isSelected = value === String(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => {
                      onChange(String(opt.value));
                      onBlur();
                    }}
                    className={`flex h-11 items-center justify-center rounded-xl text-sm font-semibold transition-all duration-150 ${
                      isSelected
                        ? 'bg-olive text-white shadow-sm ring-2 ring-olive/20'
                        : 'border border-sand bg-white text-charcoal-soft hover:border-sage-300 hover:text-charcoal active:bg-sand/30'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="relative">
              <input
                id={id}
                type="number"
                inputMode="numeric"
                min={config.min}
                max={config.max}
                step={config.step ?? 1}
                value={value}
                placeholder={config.placeholder ?? `${config.min}–${config.max}`}
                aria-invalid={Boolean(error)}
                aria-describedby={`${id}-note`}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                className={`h-11 w-full rounded-xl border px-3.5 text-[15px] font-medium text-charcoal placeholder:text-charcoal-mute/50 outline-none transition-all duration-150 focus:bg-white focus:ring-4 focus:ring-sage-100 ${
                  config.unit ? 'pr-14' : ''
                } ${
                  error
                    ? 'border-clay bg-white focus:border-clay'
                    : 'border-sand bg-white hover:border-sage-300 focus:border-sage-500'
                }`}
              />
              {config.unit && (
                <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-xs font-medium text-charcoal-mute">
                  {config.unit}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <p
        id={`${id}-note`}
        className={`mt-2 text-[12px] leading-relaxed transition-colors ${
          error ? 'font-medium text-clay' : 'text-charcoal-mute'
        }`}
      >
        {error ? error : config.hint}
      </p>
    </div>
  );
}
