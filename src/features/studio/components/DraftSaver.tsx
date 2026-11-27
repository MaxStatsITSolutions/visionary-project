import { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { saveDraft } from '../draft';
import type { StudioFormValues } from '../types';

// Невидим компонент: при всяка промяна запазва черновата.
export function DraftSaver({ activeStep }: { activeStep: number }) {
  const { values } = useFormikContext<StudioFormValues>();

  useEffect(() => {
    saveDraft({ values, activeStep });
  }, [values, activeStep]);

  return null;
}