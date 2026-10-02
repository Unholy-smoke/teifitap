import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { newGame } from '../src/game.js';
import { applyEdits, editableFields, validateEdit, readEdits } from '../src/catalogue-store.js';
const catalogue=JSON.parse(readFileSync(new URL('../data/location-catalogue.json',import.meta.url),'utf8'));
test('practice chooses exactly one of each difficulty from the expanded catalogue with varied sets',()=>{
  const sets=new Set();
  for(let i=0;i<200;i++){
    const game=newGame('2026-10-02',catalogue.places,'practice',`sample:${i}`);
    assert.deepEqual(game.ids.map(id=>catalogue.places.find(p=>p.id===id).difficulty),[1,2,3]);
    assert.equal(new Set(game.ids).size,3);sets.add(game.ids.join(','));
  }
  assert.ok(sets.size>40);
});
test('local edits apply only editable fields and cannot alter source data or enable draft daily targets',()=>{
  const p=catalogue.places[0],edit=editableFields(p);
  edit.en.name='Edited name';edit.en.fact='Edited fact';edit.difficulty=2;edit.coord=[-4.65,52.08];
  edit.enabled=true;edit.source='https://example.test';edit.id='changed';
  const next=applyEdits(catalogue,{[p.id]:edit});
  assert.equal(next.places[0].en.name,'Edited name');assert.equal(next.places[0].difficulty,2);
  assert.equal(next.places[0].enabled,false);assert.equal(next.places[0].id,p.id);
  assert.equal(next.places[0].source,p.source);assert.notEqual(p.en.name,'Edited name');
  assert.ok(validateEdit({...edit,coord:[-5,53]}));
  assert.ok(validateEdit({...edit,coord:[null,52.08]}));
  assert.ok(validateEdit({...edit,difficulty:4}));
  assert.ok(validateEdit({...edit,en:{...edit.en,name:' '}}));
  assert.deepEqual(applyEdits(catalogue,{[p.id]:{...edit,coord:[-5,53]}}).places[0],p);
  assert.deepEqual(readEdits({getItem:()=>'{broken'}),{});
});
