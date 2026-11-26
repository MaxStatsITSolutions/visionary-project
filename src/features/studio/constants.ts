import { interiorStyles as siteStyles } from '../../content/styles';
import type { StudioFormValues } from './types';

export const steps = ['Details', 'Style', 'Photo', 'Review'];

export const roomTypes = ['Living room', 'Bedroom', 'Kitchen', 'Bathroom', 'Office'];

// The same six directions as the homepage (one source: src/content/styles.ts).
export const interiorStyles = siteStyles.map((style) => ({ name: style.name, description: style.descriptor }));

export const budgetRanges = [
  'Up to €2,000',
  '€2,000 – €5,000',
  '€5,000 – €10,000',
  'Over €10,000',
];

// Photo rules (section 12.4 of the spec).
export const allowedPhotoTypes = ['image/jpeg', 'image/png', 'image/webp'];
export const maxPhotoSize = 10 * 1024 * 1024; // 10 MB

export const initialValues: StudioFormValues = {
  title: '',
  roomType: '',
  interiorStyle: '',
  budgetRange: '',
  notes: '',
};