export type StudioFormValues = {
  title: string;
  roomType: string;
  interiorStyle: string;
  budgetRange: string;
  notes: string;
};

export type PhotoSelection = { file: File; previewUrl: string };

export type StudioDraft = { values: StudioFormValues; activeStep: number };