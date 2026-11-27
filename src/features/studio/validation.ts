import { interiorStyles } from './constants';
import type { StudioFormValues } from './types';

// Which fields belong to which step (used to mark them as touched on error).
export const fieldsByStep: Record<number, (keyof StudioFormValues)[]> = {
  0: ['title', 'roomType'],
  1: ['interiorStyle'],
};

// Validates only the fields of the current step.
export function validateStep(values: StudioFormValues, step: number) {
  const errors: Partial<Record<keyof StudioFormValues, string>> = {};
  if (step === 0) {
    if (!values.title.trim()) errors.title = 'Enter a project name';
    else if (values.title.trim().length > 120) errors.title = 'The name can be up to 120 characters';
    if (!values.roomType) errors.roomType = 'Choose a room type';
  }
  if (step === 1) {
    // Also catches old drafts that saved a style which is no longer offered.
    if (!interiorStyles.some((style) => style.name === values.interiorStyle)) {
      errors.interiorStyle = 'Choose an interior style';
    }
  }
  return errors;
}