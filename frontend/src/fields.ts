import type { FieldConfig, FieldGroup, FieldKey } from './types';

export const FIELD_GROUPS: FieldGroup[] = [
  {
    title: 'Student Information',
    description: 'Demographics, academic history, and daily commute',
    fields: [
      {
        key: 'age',
        label: 'Age',
        hint: 'Student age between 15 and 22',
        min: 15,
        max: 22,
        step: 1,
        placeholder: '15–22',
      },
      {
        key: 'studytime',
        label: 'Weekly Study Time',
        hint: '1 = <2 hrs, 2 = 2–5 hrs, 3 = 5–10 hrs, 4 = >10 hrs',
        min: 1,
        max: 4,
        step: 1,
        placeholder: '1–4',
      },
      {
        key: 'failures',
        label: 'Past Class Failures',
        hint: 'Number of past class failures (0 to 3)',
        min: 0,
        max: 3,
        step: 1,
        placeholder: '0–3',
      },
      {
        key: 'absences',
        label: 'School Absences',
        hint: 'Total missed school sessions (0 to 93)',
        min: 0,
        max: 93,
        step: 1,
        placeholder: '0–93',
      },
      {
        key: 'traveltime',
        label: 'Travel Time to School',
        hint: '1 = <15 min, 2 = 15–30 min, 3 = 30–60 min, 4 = >1 hr',
        min: 1,
        max: 4,
        step: 1,
        placeholder: '1–4',
      },
    ],
  },
  {
    title: 'Educational Support',
    description: 'School assistance, family backing, and digital access',
    fields: [
      {
        key: 'schoolsup',
        label: 'Extra School Support',
        hint: 'Supplemental academic tutoring from school',
        min: 0,
        max: 1,
        step: 1,
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 1 },
        ],
      },
      {
        key: 'famsup',
        label: 'Family Support',
        hint: 'Academic guidance and encouragement at home',
        min: 0,
        max: 1,
        step: 1,
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 1 },
        ],
      },
      {
        key: 'paid',
        label: 'Paid Extra Classes',
        hint: 'Paid private tutoring classes within course subjects',
        min: 0,
        max: 1,
        step: 1,
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 1 },
        ],
      },
      {
        key: 'higher',
        label: 'Wants Higher Education',
        hint: 'Aspiration to pursue tertiary or university studies',
        min: 0,
        max: 1,
        step: 1,
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 1 },
        ],
      },
      {
        key: 'internet',
        label: 'Home Internet Access',
        hint: 'Broadband or high-speed connectivity available at home',
        min: 0,
        max: 1,
        step: 1,
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 1 },
        ],
      },
    ],
  },
  {
    title: 'Wellbeing and Social Life',
    description: 'Self-reported health status and social outings',
    fields: [
      {
        key: 'health',
        label: 'Current Health Status',
        hint: '1 = very poor health, 5 = excellent health',
        min: 1,
        max: 5,
        step: 1,
        placeholder: '1–5',
      },
      {
        key: 'goout',
        label: 'Going Out with Friends',
        hint: 'Frequency: 1 = very rare, 5 = very frequent',
        min: 1,
        max: 5,
        step: 1,
        placeholder: '1–5',
      },
    ],
  },
];

export const ALL_FIELDS: FieldConfig[] = FIELD_GROUPS.flatMap(
  (group) => group.fields,
);

export function validateField(
  field: FieldConfig,
  raw: string,
): string | null {
  if (raw === undefined || raw === null || raw.trim() === '') {
    return 'Please provide a value.';
  }

  const value = Number(raw);

  if (!Number.isFinite(value)) {
    return 'Please enter a valid number.';
  }

  if (value < field.min || value > field.max) {
    return `Must be between ${field.min} and ${field.max}.`;
  }

  if (field.step === 1 && !Number.isInteger(value)) {
    return 'Must be an integer.';
  }

  return null;
}

export type FormValues = Record<FieldKey, string>;

export type FormErrors = Partial<Record<FieldKey, string>>;

export const emptyValues = (): FormValues =>
  Object.fromEntries(
    ALL_FIELDS.map((field) => [field.key, '']),
  ) as FormValues;

export const SAMPLE_STUDENT: FormValues = {
  age: '17',
  studytime: '3',
  failures: '0',
  absences: '3',
  traveltime: '1',
  schoolsup: '0',
  famsup: '1',
  paid: '0',
  higher: '1',
  internet: '1',
  health: '4',
  goout: '3',
};

export const AT_RISK_STUDENT: FormValues = {
  age: '18',
  studytime: '1',
  failures: '2',
  absences: '16',
  traveltime: '3',
  schoolsup: '1',
  famsup: '0',
  paid: '0',
  higher: '0',
  internet: '0',
  health: '2',
  goout: '5',
};
