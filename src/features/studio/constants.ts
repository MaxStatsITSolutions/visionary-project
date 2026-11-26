import type { StudioFormValues } from './types';

export const steps = ['Details', 'Style', 'Photo', 'Review'];

export const roomTypes = ['Living room', 'Bedroom', 'Kitchen', 'Bathroom', 'Office'];

export const interiorStyles = [
  { name: 'Scandinavian', description: 'Light, cozy, natural wood' },
  { name: 'Modern', description: 'Clean lines and simple forms' },
  { name: 'Minimalist', description: 'Few pieces, lots of space' },
  { name: 'Classic', description: 'Elegant details and symmetry' },
  { name: 'Industrial', description: 'Brick, metal and raw concrete' },
  { name: 'Boho', description: 'Colorful, soft and full of plants' },
];

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