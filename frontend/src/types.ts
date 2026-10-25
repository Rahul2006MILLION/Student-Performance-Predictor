export type FieldKey =
  | 'age'
  | 'studytime'
  | 'failures'
  | 'absences'
  | 'traveltime'
  | 'schoolsup'
  | 'famsup'
  | 'paid'
  | 'higher'
  | 'internet'
  | 'health'
  | 'goout';

export type StudentInput = Record<FieldKey, number>;

export interface PredictionResult {
  probability: number;
  status: 'PASS' | 'FAIL';
}

export interface FieldOption {
  label: string;
  value: number;
}

export interface FieldConfig {
  key: FieldKey;
  label: string;
  hint: string;
  unit?: string;
  min: number;
  max: number;
  step?: number;
  placeholder?: string;
  options?: FieldOption[];
}

export interface FieldGroup {
  title: string;
  description?: string;
  fields: FieldConfig[];
}
