import type { StudioFormValues } from './types';

export const steps = ['Детайли', 'Стил', 'Снимка', 'Преглед'];

export const roomTypes = ['Хол', 'Спалня', 'Кухня', 'Баня', 'Офис'];

export const interiorStyles = [
  { name: 'Скандинавски', description: 'Светло, уютно, естествено дърво' },
  { name: 'Модерен', description: 'Чисти линии и прости форми' },
  { name: 'Минималистичен', description: 'Малко мебели, много въздух' },
  { name: 'Класически', description: 'Елегантни детайли и симетрия' },
  { name: 'Индустриален', description: 'Тухла, метал и суров бетон' },
  { name: 'Бохо', description: 'Цветно, меко и с много растения' },
];

export const budgetRanges = [
  'До 2 000 €',
  '2 000 – 5 000 €',
  '5 000 – 10 000 €',
  'Над 10 000 €',
];

// Правила за снимката (раздел 12.4 от спецификацията).
export const allowedPhotoTypes = ['image/jpeg', 'image/png', 'image/webp'];
export const maxPhotoSize = 10 * 1024 * 1024; // 10 MB

export const initialValues: StudioFormValues = {
  title: '',
  roomType: '',
  interiorStyle: '',
  budgetRange: '',
  notes: '',
};