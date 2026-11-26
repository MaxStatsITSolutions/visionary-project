/** "26 Nov 2026" — dates on project sheets. */
export function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Sheet number for the n-th project in the register: P-01, P-02, … */
export const sheetNumber = (index: number) => `P-${String(index + 1).padStart(2, '0')}`;
