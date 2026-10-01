import test from 'node:test';
import assert from 'node:assert/strict';
import { londonDate, baseScore, distanceMetres, newGame, submit, advance, validGame, shareText, total } from '../src/game.js';
import { places } from '../src/places.js';
import { mapStyle, bounds, clampCentre } from '../src/map-style.js';
test('UK daily date follows summer time, winter time and both DST boundaries', () => {
  assert.equal(londonDate(new Date('2026-07-01T23:30:00Z')), '2026-07-02');
  assert.equal(londonDate(new Date('2026-01-01T23:30:00Z')), '2026-01-01');
  assert.equal(londonDate(new Date('2026-03-29T23:30:00Z')), '2026-03-30');
  assert.equal(londonDate(new Date('2026-10-25T23:30:00Z')), '2026-10-25');
});
test('geographic distance and scoring are meaningful and monotonic', () => {
  assert.equal(distanceMetres([0, 0], [0, 0]), 0);
  assert.ok(Math.abs(distanceMetres([0, 0], [0, 1]) - 111195) < 1);
  assert.equal(baseScore(50), 100); assert.equal(baseScore(550), 50);
  for (let d = 0; d < 20000; d += 10) assert.ok(baseScore(d) >= baseScore(d + 10));
});
test('daily set is deterministic, distinct, ordered by difficulty and independent of pool order', () => {
  const a = newGame('2026-10-01', places), b = newGame('2026-10-01', [...places].reverse());
  assert.deepEqual(a.ids, b.ids); assert.equal(new Set(a.ids).size, 3);
  const difficulties = a.ids.map(id => places.find(p => p.id === id).difficulty);
  assert.deepEqual(difficulties, [...difficulties].sort());
});
test('three-round flow locks each answer, saves reveals and totals weighted scores', () => {
  let game = newGame('2026-10-01', places);
  for (let i = 0; i < 3; i++) {
    game = submit(game, places.find(p => p.id === game.ids[i]).coord, places);
    assert.equal(game.phase, 'reveal'); assert.equal(game.answers.length, i + 1);
    assert.strictEqual(submit(game, [0, 0], places), game);
    assert.ok(validGame(JSON.parse(JSON.stringify(game)), places));
    game = advance(game);
  }
  assert.equal(game.phase, 'complete'); assert.equal(total(game.answers), 600);
  assert.ok(validGame(game, places));
  const shared = shareText(game, 'en', 'https://example.test');
  assert.ok(shared.includes('100🎯 100🎯 100🎯')); assert.ok(shared.includes('Final score: 600'));
  for (const p of places) assert.ok(!shared.includes(p.en.name));
});
test('corrupt or incompatible saved games are rejected', () => {
  const game = newGame('2026-10-01', places);
  assert.equal(validGame({ ...game, phase: 'complete' }, places), false);
  assert.equal(validGame({ ...game, ids: ['missing', ...game.ids.slice(1)] }, places), false);
  assert.equal(validGame({ ...game, answers: [{ score: NaN }] }, places), false);
});
test('all targets fit the area and map cannot render labels or POIs', () => {
  for (const p of places) assert.ok(p.coord[0] > bounds[0][0] && p.coord[0] < bounds[1][0] && p.coord[1] > bounds[0][1] && p.coord[1] < bounds[1][1]);
  assert.ok(mapStyle.layers.every(layer => ['background', 'fill', 'line'].includes(layer.type)));
  assert.ok(mapStyle.layers.every(layer => !['poi', 'place', 'building', 'transportation_name'].includes(layer['source-layer'])));
});
test('centre constraint leaves all playable points reachable, including edges', () => {
  for (const p of places) assert.deepEqual(clampCentre(p.coord), p.coord);
  for (const x of [bounds[0][0], bounds[1][0]]) for (const y of [bounds[0][1], bounds[1][1]]) assert.deepEqual(clampCentre([x, y]), [x, y]);
  assert.deepEqual(clampCentre([-5, 53]), [bounds[0][0], bounds[1][1]]);
});
