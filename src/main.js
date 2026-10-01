import * as maplibregl from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'maplibre-gl/dist/maplibre-gl.css';
import './style.css';
import { places } from './places.js';
import { bounds, home, mapStyle } from './map-style.js';
import { cameraOptions } from './map-camera.js';
import { londonDate, displayDate, newGame, validGame, submit, advance, total, emoji, shareText, WEIGHTS } from './game.js';
maplibregl.setWorkerUrl(workerUrl);

const KEY = 'teifitap.daily.v1';
const copy = {
  en: { strap: 'Know your corner of the world.', daily: 'The daily wander', practice: 'A practice wander', round: 'Round', of: 'of', find: 'Can you find…', easy: 'A familiar place', medium: 'A closer look', hard: 'The final stretch', help: 'Move the map. Trust your memory.', instructions: 'Drag the map beneath the pin. Zoom in, then confirm your spot.', confirm: 'Confirm my spot', loading: 'Loading the map…', reset: 'Whole area', score: 'Points', hint: 'Roads, river, coastline. The rest is up to you.', next: 'Next place', results: 'See my results', away: 'from the spot', right: 'The right spot', yours: 'Your guess', fact: 'A little local knowledge', source: 'Read more', finished: 'Your Teifi, explored.', done: 'Three places. One lovely corner of Wales.', share: 'Share my score', copy: 'Copy result', copied: 'Result copied.', manual: 'Select and copy your result below.', practiceButton: 'Try a practice game', dailyButton: 'Back to daily', practiceNote: 'Practice · your daily score is safe', footer: 'Three places · one river · every day', tolerance: 'Within 50 m earns full marks. Aim for the centre of the place.', scoring: '1× · 2× · 3× — up to 600 points', retry: 'Retry map', mapError: 'The map could not load. Check your connection, then retry.', storage: 'Progress cannot be saved in this browser. Keep this tab open to finish.', fresh: 'A new daily puzzle is ready.', freshButton: 'Play today’s puzzle', close: 'Close', about: 'How to play', welcome: 'Follow the river. Find your bearings.', explanation: 'Three named places around Cardigan, St Dogmaels, Gwbert and Cilgerran. No labels and no timer. Centre the pin on each place and confirm. Each round is worth up to 100 points, multiplied by 1, 2 and 3. Your daily progress is saved on this device.', local: 'Local playtest · five-place pool', north: 'North', distance: 'Distance', weighted: 'Weighted points' },
  cy: { strap: 'Pa mor dda ydych chi’n adnabod eich bro?', daily: 'Her y dydd', practice: 'Gêm ymarfer', round: 'Rownd', of: 'o', find: 'Allwch chi ddod o hyd i…', easy: 'Lle cyfarwydd', medium: 'Golwg agosach', hard: 'Y rownd olaf', help: 'Symudwch y map. Dilynwch eich cof.', instructions: 'Llusgwch y map o dan y pin. Chwyddwch, yna cadarnhewch eich man.', confirm: 'Cadarnhau fy man', loading: 'Llwytho’r map…', reset: 'Yr ardal gyfan', score: 'Pwyntiau', hint: 'Ffyrdd, afon, arfordir. Chi sydd â’r gweddill.', next: 'Y lle nesaf', results: 'Gweld fy nghanlyniadau', away: 'o’r man', right: 'Y man cywir', yours: 'Eich dyfaliad', fact: 'Tipyn o wybodaeth leol', source: 'Darllen mwy', finished: 'Eich taith ar hyd y Teifi.', done: 'Tri lle. Un gornel hyfryd o Gymru.', share: 'Rhannu fy sgôr', copy: 'Copïo’r canlyniad', copied: 'Wedi copïo’r canlyniad.', manual: 'Dewiswch a chopïwch eich canlyniad isod.', practiceButton: 'Rhoi cynnig ar gêm ymarfer', dailyButton: 'Yn ôl i her y dydd', practiceNote: 'Ymarfer · mae eich sgôr ddyddiol yn ddiogel', footer: 'Tri lle · un afon · bob dydd', tolerance: 'O fewn 50 m am y pwyntiau llawn. Anelwch at ganol y lle.', scoring: '1× · 2× · 3× — hyd at 600 pwynt', retry: 'Ail-lwytho’r map', mapError: 'Methu llwytho’r map. Gwiriwch eich cysylltiad a rhowch gynnig arall.', storage: 'Ni ellir cadw cynnydd yn y porwr hwn. Cadwch y tab ar agor.', fresh: 'Mae her ddyddiol newydd yn barod.', freshButton: 'Chwarae her heddiw', close: 'Cau', about: 'Sut i chwarae', welcome: 'Dilynwch yr afon. Dewch o hyd i’ch ffordd.', explanation: 'Tri lle o amgylch Aberteifi, Llandudoch, Gwbert a Chilgerran. Dim labeli a dim amserydd. Rhowch y pin dros bob lle a chadarnhewch. Hyd at 100 pwynt ym mhob rownd, wedi eu lluosi ag 1, 2 a 3. Cedwir eich cynnydd ar y ddyfais hon.', local: 'Prawf lleol · cronfa o bum lle', north: 'Gogledd', distance: 'Pellter', weighted: 'Pwyntiau wedi eu lluosi' },
};
let lang = 'en', saved, storageOK = true;
try { lang = localStorage.getItem('teifitap.language') === 'cy' ? 'cy' : 'en'; saved = JSON.parse(localStorage.getItem(KEY)); } catch { storageOK = false; }
let game = validGame(saved, places) && (saved.date === londonDate() || saved.phase !== 'complete') ? saved : newGame(londonDate(), places);
let map, ready = false, mapFailed = false, revealMarkers = [], lastView = '', sharing = false;
const t = key => copy[lang][key];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const formatDate = date => displayDate(date, lang);
const distanceLabel = metres => metres < 1000 ? `${Math.round(metres)} m` : `${(metres / 1000).toFixed(2)} km`;
function persist() { if (game.mode !== 'daily') return; try { localStorage.setItem(KEY, JSON.stringify(game)); } catch { storageOK = false; } }

document.querySelector('#app').innerHTML = `
  <header class="masthead"><a class="brand" href="./" aria-label="TeifiTap home"><span class="brand-mark" aria-hidden="true">⌖</span>Teifi<span>Tap</span><small>ABERTEIFI & BRO</small></a><div class="header-right"><span id="date"></span><button id="language" class="text-button"></button><button id="about" class="help-button" aria-label="How to play">?</button></div></header>
  <main class="play-layout"><section class="map-wrap" aria-label="Map"><div id="map"></div><div class="map-top"><span class="map-tag">EST. 2026 <i></i> TEIFI</span><button id="reset-map" class="map-button"></button></div><div id="pin" class="centre-pin" aria-hidden="true"><svg viewBox="0 0 40 52"><path d="M20 52C17 41 2 30 2 19a18 18 0 1 1 36 0c0 11-15 22-18 33Z" fill="currentColor" stroke="#fffaf0" stroke-width="2"/><circle cx="20" cy="19" r="6" fill="#fffaf0"/></svg><span></span></div><div id="map-message" role="status"></div><div id="legend"></div><div class="compass" aria-hidden="true"><b>N</b><span>↑</span></div></section><aside id="panel" class="panel" aria-live="polite"></aside></main>
  <footer class="footer"><span id="footer-line"></span><span id="local-note"></span></footer><dialog id="help"><button id="close-help" class="text-button"></button><p class="eyebrow">TEIFITAP</p><h2 id="welcome"></h2><p id="explanation"></p><p id="scoring-help" class="small"></p></dialog><div id="toast" role="status"></div>`;

function render() {
  document.documentElement.lang = lang;
  document.querySelector('#app').dataset.phase = game.phase;
  document.querySelector('#app').dataset.mode = game.mode;
  document.querySelector('#date').textContent = formatDate(game.date);
  document.querySelector('#language').textContent = lang === 'en' ? 'Cymraeg' : 'English';
  document.querySelector('#language').lang = lang === 'en' ? 'cy' : 'en';
  document.querySelector('#reset-map').textContent = `⤢ ${t('reset')}`;
  document.querySelector('#about').setAttribute('aria-label', t('about'));
  document.querySelector('#close-help').textContent = `${t('close')} ×`;
  document.querySelector('#welcome').textContent = t('welcome');
  document.querySelector('#explanation').textContent = t('explanation');
  document.querySelector('#scoring-help').textContent = `${t('scoring')} · ${t('tolerance')}`;
  document.querySelector('#footer-line').textContent = t('footer');
  document.querySelector('#local-note').textContent = t('local');
  if (map) {
    map.getCanvas().setAttribute('aria-label', lang === 'en' ? 'Unlabelled map. Use arrow keys to pan and plus or minus to zoom.' : 'Map heb labeli. Defnyddiwch y bysellau saeth i symud.');
    document.querySelector('.maplibregl-ctrl-zoom-in')?.setAttribute('aria-label', lang === 'en' ? 'Zoom in' : 'Chwyddo');
    document.querySelector('.maplibregl-ctrl-zoom-out')?.setAttribute('aria-label', lang === 'en' ? 'Zoom out' : 'Lleihau');
  }
  const resetTest = document.querySelector('#reset-test');
  if (resetTest) resetTest.textContent = lang === 'en' ? 'Restart today’s local test' : 'Ailgychwyn prawf lleol heddiw';
  const panel = document.querySelector('#panel');
  const round = Math.min(2, game.phase === 'guess' ? game.answers.length : game.answers.length - 1);
  const place = places.find(p => p.id === game.ids[Math.max(0, round)]);
  const p = place[lang];
  const progress = WEIGHTS.map((w, i) => `<span class="step ${game.answers[i] ? 'answered' : i === round ? 'current' : ''}"><b>${game.answers[i] ? game.answers[i].score : i + 1}</b><small>×${w}</small></span>`).join('<span class="step-line"></span>');
  const modeLabel = t(game.mode === 'practice' ? 'practice' : 'daily');
  let body = '';
  if (game.phase === 'guess') {
    body = `<div class="question"><p class="eyebrow">${t('find')}</p><h1>${p.name}<span>${p.town}</span></h1><div class="difficulty"><em class="mobile-round">${t('round')} ${round + 1}/3 · </em><span></span>${t(['easy', 'medium', 'hard'][round])}<b>×${WEIGHTS[round]}</b></div></div><div class="guide"><div class="guide-icon" aria-hidden="true">⌖</div><h2>${t('help')}</h2><p>${t('instructions')}</p></div><div class="panel-bottom"><button id="confirm" class="primary" disabled>${t('loading')}</button><p class="small centre">${t('tolerance')}</p><p class="mobile-instruction">${t('instructions')}</p></div>`;
  } else if (game.phase === 'reveal') {
    const a = game.answers.at(-1);
    body = `<div class="reveal-heading"><span class="result-emoji">${emoji(a.score)}</span><p class="eyebrow">${t('right')}</p><h1>${p.name}<span>${p.town}</span></h1></div><div class="result-numbers"><div><strong>${distanceLabel(a.distance)}</strong><span>${t('away')}</span></div><div><strong>${a.score}<small> × ${WEIGHTS[round]}</small></strong><span>${a.score * WEIGHTS[round]} ${t('score').toLowerCase()}</span></div></div><article class="fact"><p class="eyebrow">${t('fact')}</p><p>${p.fact}</p><a href="${place.source}" target="_blank" rel="noopener noreferrer">${t('source')} ↗</a></article><div class="panel-bottom"><button id="next" class="primary">${t(game.answers.length === 3 ? 'results' : 'next')} <span>→</span></button></div>`;
  } else {
    body = `<div class="complete"><div class="seal" aria-hidden="true">⌖</div><h1>${t('finished')}</h1><p>${t('done')}</p><div class="final-score">${total(game.answers)}<span>/ 600</span></div><p class="eyebrow">${t('score')}</p></div><div class="breakdown">${game.answers.map((a, i) => { const q = places.find(p => p.id === a.id)[lang]; return `<div><span class="row-emoji">${emoji(a.score)}</span><span>${q.name}<small>${q.town} · ${distanceLabel(a.distance)}</small></span><b>${a.score}<small>×${WEIGHTS[i]}</small></b></div>`; }).join('')}</div><div class="panel-bottom"><button id="share" class="primary">${t('share')} ↗</button><button id="copy" class="secondary">${t('copy')}</button><textarea id="manual-share" readonly hidden aria-label="Result"></textarea><button id="practice" class="text-button wide">${t('practiceButton')} →</button></div>`;
  }
  panel.innerHTML = `<div class="panel-heading"><p class="eyebrow">${modeLabel}</p><span class="running-score">${total(game.answers)} <small>${t('score').toLowerCase()}</small></span></div><div class="progress" aria-label="${t('round')} ${round + 1} ${t('of')} 3">${progress}</div>${body}${game.mode === 'practice' ? `<button id="daily" class="text-button wide">← ${t('dailyButton')}</button><p class="small centre">${t('practiceNote')}</p>` : ''}${!storageOK ? `<p class="warning">${t('storage')}</p>` : ''}${game.date !== londonDate() ? `<div class="new-day"><p>${t('fresh')}</p><button id="fresh" class="secondary">${t('freshButton')}</button></div>` : ''}`;
  panel.querySelector('#confirm')?.addEventListener('click', () => {
    if (!ready || game.phase !== 'guess' || map.isMoving() || !map.areTilesLoaded()) return;
    game = submit(game, map.getCenter().toArray(), places); persist(); render(); updateMap();
  });
  panel.querySelector('#next')?.addEventListener('click', () => { game = advance(game); persist(); render(); updateMap(); panel.scrollTop = 0; });
  panel.querySelector('#share')?.addEventListener('click', doShare);
  panel.querySelector('#copy')?.addEventListener('click', doCopy);
  panel.querySelector('#practice')?.addEventListener('click', () => { game = newGame(londonDate(), places, 'practice', `practice:${Date.now()}`); render(); updateMap(); panel.scrollTop = 0; });
  panel.querySelector('#daily')?.addEventListener('click', loadDaily);
  panel.querySelector('#fresh')?.addEventListener('click', () => { game = newGame(londonDate(), places); persist(); render(); updateMap(); });
  document.querySelector('#pin').hidden = game.phase !== 'guess';
  document.querySelector('#legend').innerHTML = game.phase === 'reveal' ? `<span><i class="guess-dot"></i>${t('yours')}</span><span><i class="answer-dot"></i>${t('right')}</span>` : '';
  updateReady();
}
function loadDaily() {
  let stored; try { stored = JSON.parse(localStorage.getItem(KEY)); } catch { /* fallback below */ }
  game = validGame(stored, places) && (stored.date === londonDate() || stored.phase !== 'complete') ? stored : newGame(londonDate(), places);
  render(); updateMap();
}
function updateReady() {
  const button = document.querySelector('#confirm');
  if (button) { button.disabled = !ready; button.textContent = ready ? `${t('confirm')} →` : t('loading'); }
}
function toast(text) { const e = document.querySelector('#toast'); e.textContent = text; e.classList.add('visible'); clearTimeout(toast.timer); toast.timer = setTimeout(() => e.classList.remove('visible'), 3500); }
function resultText() { return shareText(game, lang, `${location.origin}${location.pathname}`); }
async function doCopy() {
  try { await navigator.clipboard.writeText(resultText()); toast(t('copied')); }
  catch { const box = document.querySelector('#manual-share'); box.hidden = false; box.value = resultText(); box.focus(); box.select(); toast(t('manual')); }
}
async function doShare() {
  if (sharing) return;
  if (!navigator.share) return doCopy();
  sharing = true;
  try { await navigator.share({ text: resultText() }); }
  catch (error) { if (error.name !== 'AbortError') toast(lang === 'en' ? 'Sharing is unavailable. Use Copy result.' : 'Nid yw rhannu ar gael. Defnyddiwch Copïo’r canlyniad.'); }
  finally { sharing = false; }
}
function showMapMessage(error = false) {
  const el = document.querySelector('#map-message');
  el.innerHTML = error ? `<p>${t('mapError')}</p><button id="retry-map" class="secondary">${t('retry')}</button>` : `<p>${t('loading')}</p>`;
  el.hidden = false;
  el.querySelector('button')?.addEventListener('click', () => { lastView = ''; ready = false; mapFailed = false; map.remove(); initialiseMap(); });
}
function initialiseMap() {
  showMapMessage();
  try {
    map = new maplibregl.Map({ container: 'map', style: mapStyle, ...cameraOptions, attributionControl: false, keyboard: true });
  } catch { mapFailed = true; showMapMessage(true); return; }
  map.touchZoomRotate.disableRotation();
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
  map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');
  map.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-left');
  map.getCanvas().setAttribute('aria-label', lang === 'en' ? 'Unlabelled map. Use arrow keys to pan and plus or minus to zoom.' : 'Map heb labeli. Defnyddiwch y bysellau saeth i symud.');
  map.on('load', () => { addRevealSource(); updateMap(); });
  map.on('movestart', () => { ready = false; updateReady(); });
  const syncReadiness = () => {
    const nextReady = map.isStyleLoaded() && map.areTilesLoaded() && !map.isMoving() && !mapFailed;
    if (nextReady !== ready) { ready = nextReady; updateReady(); }
    if (ready) document.querySelector('#map-message').hidden = true;
  };
  map.on('idle', syncReadiness);
  map.on('render', syncReadiness);
  map.on('moveend', syncReadiness);
  map.on('error', event => { console.error('Map load:', event.error?.message); mapFailed = true; ready = false; updateReady(); showMapMessage(true); });
  // A slow/offline tile request must not leave the user indefinitely staring at paper.
  const thisMap = map;
  setTimeout(() => { if (map === thisMap && !ready && !map.isMoving()) showMapMessage(true); }, 20000);
}
function addRevealSource() {
  map.addSource('answer-line', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
  map.addLayer({ id: 'answer-line', type: 'line', source: 'answer-line', paint: { 'line-color': '#a7533c', 'line-width': 2.5, 'line-dasharray': [2, 2] } });
}
function marker(coord, type, label) {
  const el = document.createElement('div'); el.className = `map-marker ${type}`; el.setAttribute('role', 'img'); el.setAttribute('aria-label', label);
  el.textContent = type === 'answer' ? '✓' : '•';
  revealMarkers.push(new maplibregl.Marker({ element: el }).setLngLat(coord).addTo(map));
}
function updateMap() {
  if (!map?.getSource('answer-line')) return;
  const view = `${game.mode}:${game.date}:${game.ids.join(',')}:${game.phase}:${game.answers.length}`;
  if (lastView === view) return;
  lastView = view;
  revealMarkers.forEach(m => m.remove()); revealMarkers = [];
  const features = [];
  const points = [];
  const answers = game.phase === 'guess' ? [] : game.phase === 'reveal' ? [game.answers.at(-1)] : game.answers;
  for (const a of answers) {
    const place = places.find(p => p.id === a.id);
    marker(a.guess, 'guess', t('yours')); marker(place.coord, 'answer', `${t('right')}: ${place[lang].name}`);
    features.push({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [a.guess, place.coord] } });
    points.push(a.guess, place.coord);
  }
  map.getSource('answer-line').setData({ type: 'FeatureCollection', features });
  if (points.length) {
    const box = points.reduce((box, coord) => box.extend(coord), new maplibregl.LngLatBounds(points[0], points[0]));
    map.fitBounds(box, { padding: 75, maxZoom: 16, duration: reducedMotion ? 0 : 650 });
  } else { map.easeTo({ ...home, duration: reducedMotion ? 0 : 500 }); }
}
document.querySelector('#language').addEventListener('click', () => { lang = lang === 'en' ? 'cy' : 'en'; try { localStorage.setItem('teifitap.language', lang); } catch { /* language remains active */ } render(); if (mapFailed) showMapMessage(true); });
document.querySelector('#reset-map').addEventListener('click', () => map?.fitBounds(bounds, { padding: 25, duration: reducedMotion ? 0 : 500 }));
document.querySelector('#about').addEventListener('click', () => document.querySelector('#help').showModal());
document.querySelector('#close-help').addEventListener('click', () => document.querySelector('#help').close());
if (import.meta.env.DEV) {
  const button = document.createElement('button'); button.id = 'reset-test'; button.className = 'secondary';
  button.addEventListener('click', () => { game = newGame(londonDate(), places); persist(); lastView = ''; render(); updateMap(); document.querySelector('#help').close(); });
  document.querySelector('#help').append(button);
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });
setInterval(() => { if (game.date !== londonDate() && !document.querySelector('#fresh')) render(); }, 30000);
render(); persist(); initialiseMap();
new ResizeObserver(() => map?.resize()).observe(document.querySelector('.map-wrap'));
