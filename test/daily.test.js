import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { DAILY_KEY, scheduledDay, scheduledGame, readHistory, restoreDaily, historyStats } from '../src/daily.js';
import { submit,advance } from '../src/game.js';
const schedule=JSON.parse(fs.readFileSync(new URL('../data/daily-schedule.json',import.meta.url)));
test('published week has one of each difficulty, no repeats and frozen point targets',()=>{
  const ids=schedule.days.flatMap(d=>d.places.map(p=>p.id));
  assert.ok(schedule.days.length>=7);assert.equal(new Set(ids).size,schedule.days.length*3);
  for(const day of schedule.days){assert.deepEqual(day.places.map(p=>p.difficulty),[1,2,3]);assert.ok(day.places.every(p=>p.targetType==='point'));assert.deepEqual(scheduledGame(schedule,day.date).ids,day.places.map(p=>p.id));}
  assert.deepEqual(scheduledGame(schedule,'2026-10-02').ids,['cardigan-rugby-club','ferry-inn','mantle-brewery']);
  assert.equal(scheduledDay(schedule,'2099-10-09').date,schedule.days.at(-1).date,'exhaustion must not silently repeat targets on a new date');
});
function finish(date){let g=scheduledGame(schedule,date);for(let i=0;i<3;i++)g=advance(submit(g,schedule.days.find(d=>d.date===date).places[i].coord,schedule.days.find(d=>d.date===date).places));return g;}
test('daily history restores answers and retains older results without accepting test games',()=>{
  const history={'2026-10-02':finish('2026-10-02'),'2026-10-03':finish('2026-10-03')};
  const storage={getItem:key=>key===DAILY_KEY?JSON.stringify(history):null};
  const restored=readHistory(storage,schedule);assert.equal(Object.keys(restored).length,2);
  assert.deepEqual(restoreDaily(schedule,'2026-10-03',restored),history['2026-10-03']);
  assert.equal(restoreDaily(schedule,'2026-10-04',restored).answers.length,0);
  history['2026-10-02'].ids.reverse();assert.equal(readHistory(storage,schedule)['2026-10-02'],undefined);
  assert.deepEqual(readHistory({getItem:()=>'{broken'},schedule),{});
  assert.deepEqual(readHistory({getItem:()=>{throw Error('blocked');}},schedule),{});
});
test('streaks count completed daily dates once and survive midnight until a missed day',()=>{
  const h={'2026-10-02':finish('2026-10-02'),'2026-10-03':finish('2026-10-03')};
  assert.deepEqual(historyStats(h,'2026-10-03'),{played:2,streak:2});
  assert.deepEqual(historyStats(h,'2026-10-04'),{played:2,streak:2});
  assert.deepEqual(historyStats(h,'2026-10-05'),{played:2,streak:0});
});
