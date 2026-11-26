import { initialValues, steps } from './constants';
import type { StudioDraft } from './types';

const DRAFT_KEY = 'visionary:studio-draft-v2';

export function loadDraft(): StudioDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<StudioDraft>;
    if (!data.values || typeof data.activeStep !== 'number') return null;
    return {
      values: { ...initialValues, ...data.values },
      activeStep: Math.min(Math.max(data.activeStep, 0), steps.length - 1),
    };
  } catch {
    return null; // повредена чернова или недостъпно хранилище
  }
}

export function saveDraft(draft: StudioDraft) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Ако браузърът не позволява запис, продължаваме без чернова.
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // нищо за правене
  }
}