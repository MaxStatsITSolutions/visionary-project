import type { StudioFormValues } from './types';

// Кои полета принадлежат на коя стъпка (за "touched" при грешка).
export const fieldsByStep: Record<number, (keyof StudioFormValues)[]> = {
  0: ['title', 'roomType'],
  1: ['interiorStyle'],
};

// Проверява само полетата на текущата стъпка.
export function validateStep(values: StudioFormValues, step: number) {
  const errors: Partial<Record<keyof StudioFormValues, string>> = {};
  if (step === 0) {
    if (!values.title.trim()) errors.title = 'Въведи име на проекта';
    if (!values.roomType) errors.roomType = 'Избери помещение';
  }
  if (step === 1) {
    if (!values.interiorStyle) errors.interiorStyle = 'Избери интериорен стил';
  }
  return errors;
}