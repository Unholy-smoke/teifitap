export const VERSION = 1;
export const WEIGHTS = [1, 2, 3];
export function londonDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}
export function displayDate(date, lang = 'en', includeYear = false) {
  const value = new Date(`${date}T12:00:00Z`);
  if (lang === 'cy') {
    const months = ['Ionawr', 'Chwefror', 'Mawrth', 'Ebrill', 'Mai', 'Mehefin', 'Gorffennaf', 'Awst', 'Medi', 'Hydref', 'Tachwedd', 'Rhagfyr'];
    return `${value.getUTCDate()} ${months[value.getUTCMonth()]}${includeYear ? ` ${value.getUTCFullYear()}` : ''}`;
  }
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', ...(includeYear ? { year: 'numeric' } : {}), timeZone: 'Europe/London' }).format(value);
}
export function distanceMetres(a, b) {
  const rad = x => x * Math.PI / 180;
  const dLat = rad(b[1] - a[1]), dLon = rad(b[0] - a[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[1])) * Math.cos(rad(b[1])) * Math.sin(dLon / 2) ** 2;
  return 6371008.8 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
}
// Generous site-centre tolerance for this first local playtest; then a 500 m half-life.
export function baseScore(metres) {
  return Math.max(0, Math.min(100, Math.round(100 * 2 ** (-Math.max(0, metres - 50) / 500))));
}
export function emoji(score) { return score === 100 ? '🎯' : score >= 95 ? '🔥' : score >= 85 ? '🎉' : score >= 70 ? '🤗' : score >= 50 ? '🙂' : score >= 30 ? '🧭' : '❄️'; }
export function total(answers) { return answers.reduce((sum, a, i) => sum + a.score * WEIGHTS[i], 0); }
export function hash(text) { let n = 2166136261; for (const c of text) n = Math.imul(n ^ c.charCodeAt(0), 16777619); return n >>> 0; }
export function selectPlaces(seed, places) {
  // All five are deliberately approachable. Rank chosen targets by provisional difficulty.
  return [...places].sort((a, b) => hash(`${seed}:${a.id}`) - hash(`${seed}:${b.id}`) || a.id.localeCompare(b.id)).slice(0, 3).sort((a, b) => a.difficulty - b.difficulty || a.id.localeCompare(b.id));
}
export function newGame(date, places, mode = 'daily', seed = date) {
  const chosen = mode === 'practice' ? [1,2,3].map(difficulty => {
    const candidates = places.filter(p => p.difficulty === difficulty);
    if (!candidates.length) throw new Error(`No practice locations at difficulty ${difficulty}`);
    return candidates.sort((a,b) => hash(`${seed}:${a.id}`)-hash(`${seed}:${b.id}`) || a.id.localeCompare(b.id))[0];
  }) : selectPlaces(seed,places);
  return { version: VERSION, date, mode, ids: chosen.map(p => p.id), answers: [], phase: 'guess' };
}
export function validGame(game, places) {
  if (!game || game.version !== VERSION || game.mode !== 'daily' || !/^\d{4}-\d{2}-\d{2}$/.test(game.date) || !Array.isArray(game.ids) || game.ids.length !== 3 || new Set(game.ids).size !== 3 || game.ids.some(id => !places.some(p => p.id === id)) || !Array.isArray(game.answers) || game.answers.length > 3 || !['guess', 'reveal', 'complete'].includes(game.phase)) return false;
  if ((game.phase === 'guess' && game.answers.length === 3) || (game.phase === 'reveal' && !game.answers.length) || (game.phase === 'complete' && game.answers.length !== 3)) return false;
  const parsedDate = new Date(`${game.date}T12:00:00Z`);
  if (!Number.isFinite(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== game.date) return false;
  return game.answers.every((a, i) => a.id === game.ids[i] && Array.isArray(a.guess) && a.guess.length === 2 && a.guess.every(Number.isFinite) && Math.abs(a.guess[0]) <= 180 && Math.abs(a.guess[1]) <= 90 && Number.isFinite(a.distance) && a.distance >= 0 && Number.isInteger(a.score) && a.score >= 0 && a.score <= 100);
}
export function submit(game, guess, places) {
  if (game.phase !== 'guess') return game;
  const place = places.find(p => p.id === game.ids[game.answers.length]);
  const distance = distanceMetres(guess, place.coord);
  return { ...game, phase: 'reveal', answers: [...game.answers, { id: place.id, guess, distance, score: baseScore(distance) }] };
}
export function advance(game) { return game.phase !== 'reveal' ? game : { ...game, phase: game.answers.length === 3 ? 'complete' : 'guess' }; }
export function shareText(game, lang = 'en', url = '') {
  const date = displayDate(game.date, lang, true);
  return [`TeifiTap${game.mode === 'practice' ? (lang === 'cy' ? ' · Ymarfer' : ' · Practice') : ''} · ${date}`, game.answers.map(a => `${a.score}${emoji(a.score)}`).join(' '), `${lang === 'cy' ? 'Sgôr derfynol' : 'Final score'}: ${total(game.answers)}`, url].filter(Boolean).join('\n');
}
