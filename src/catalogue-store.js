import { bounds } from './map-style.js';
export const CATALOGUE_KEY = 'teifitap.catalogue-edits.v1';
export function validateEdit(p) {
  if (p.reviewStatus !== undefined && !['locally-reviewed','needs-local-review'].includes(p.reviewStatus)) return 'Choose a valid review status.';
  if (![1,2,3].includes(p.difficulty)) return 'Choose difficulty 1, 2 or 3.';
  for (const lang of ['en','cy']) for (const field of ['name','town','fact']) {
    if (typeof p[lang]?.[field] !== 'string' || !p[lang][field].trim()) return 'Fill in both languages, including the town and fact.';
  }
  if (!Array.isArray(p.coord) || p.coord.length !== 2 || p.coord.some((v,i) => !Number.isFinite(v) || v < bounds[0][i] || v > bounds[1][i])) return 'Choose a location inside the playable area.';
  return '';
}
export function editableFields(p) {
  return { difficulty:p.difficulty, coord:[...p.coord], en:{...p.en}, cy:{...p.cy}, ...(['locally-reviewed','needs-local-review'].includes(p.reviewStatus) ? {reviewStatus:p.reviewStatus} : {}) };
}
export function applyEdits(catalogue, edits = {}) {
  return { ...catalogue, places: catalogue.places.map(p => {
    const edit = edits[p.id];
    if (!edit || validateEdit(edit)) return structuredClone(p);
    return {...structuredClone(p), ...editableFields(edit), coordinateMethod: edit.coord.some((v,i)=>v!==p.coord[i]) ? 'Locally edited reference pin' : p.coordinateMethod};
  }) };
}
export function readEdits(storage) {
  try { const edits = JSON.parse(storage.getItem(CATALOGUE_KEY) || '{}'); return edits && typeof edits === 'object' && !Array.isArray(edits) ? edits : {}; } catch { return {}; }
}
