import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { bounds } from '../src/map-style.js';
import { wholeAreaView } from '../src/whole-area.js';
const catalogue = JSON.parse(readFileSync(new URL('../data/location-catalogue.json', import.meta.url), 'utf8'));
test('catalogue retains the original 33 candidates and adds sourced bilingual research drafts', () => {
  assert.equal(catalogue.places.length,54);
  assert.equal(new Set(catalogue.places.map(p=>p.id)).size,54);
  assert.deepEqual([1,2,3].map(d=>catalogue.places.filter(p=>p.difficulty===d).length),[16,20,18]);
  assert.deepEqual([1,2,3].map(d=>catalogue.places.slice(0,33).filter(p=>p.difficulty===d).length),[9,13,11]);
  assert.deepEqual([1,2,3].map(d=>catalogue.places.filter(p=>p.discoveryBatch&&p.difficulty===d).length),[7,7,7]);
  for(const p of catalogue.places){
    assert.equal(p.enabled,false,'Research drafts must not enter the daily pool');
    for(const lang of ['en','cy'])for(const field of ['name','town','fact'])assert.ok(p[lang][field]);
    for(const field of ['source','coordinateSource'])assert.equal(new URL(p[field]).protocol,'https:');
    for(let i=0;i<2;i++)assert.ok(p.coord[i]>=bounds[0][i]&&p.coord[i]<=bounds[1][i],p.id);
  }
  assert.equal(catalogue.places.find(p=>p.id==='teifi-boating-club').difficulty,2);
  assert.match(catalogue.places.find(p=>p.id==='banc-y-warren-summit').en.name,/summit/);
  assert.equal(catalogue.places.find(p=>p.id==='maesglas').targetType,'area');
});
test('whole-area view responds to both viewport dimensions and uses an interior centre',()=>{
  const small=wholeAreaView(320,420), large=wholeAreaView(1200,720);
  assert.ok(large.zoom>small.zoom);
  assert.ok(wholeAreaView(320,200).zoom<small.zoom);
  for(let i=0;i<2;i++)assert.ok(small.center[i]>bounds[0][i]&&small.center[i]<bounds[1][i]);
  assert.ok(Number.isFinite(wholeAreaView(0,0).zoom));
});
