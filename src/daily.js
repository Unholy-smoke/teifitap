import { newGame, validGame } from './game.js';
export const DAILY_KEY = 'teifitap.scheduled-days.v1';
export function scheduledDay(schedule, date) {
  return [...schedule.days].filter(d=>d.date<=date).sort((a,b)=>b.date.localeCompare(a.date))[0] || schedule.days[0];
}
export function scheduledGame(schedule, date) {
  const day=scheduledDay(schedule,date);
  return newGame(day.date,day.places);
}
export function readHistory(storage, schedule) {
  let raw; try {raw=JSON.parse(storage.getItem(DAILY_KEY)||'{}');} catch {return {};}
  if (!raw || typeof raw!=='object' || Array.isArray(raw)) return {};
  return Object.fromEntries(schedule.days.filter(day=>{
    const game=raw[day.date];
    return validGame(game,day.places)&&game.date===day.date&&game.ids.every((id,i)=>id===day.places[i].id);
  }).map(day=>[day.date,raw[day.date]]));
}
export function restoreDaily(schedule,date,history) {
  const fresh=scheduledGame(schedule,date);
  return history[fresh.date] || fresh;
}
export function historyStats(history,date) {
  const completed=Object.values(history).filter(g=>g.phase==='complete').map(g=>g.date).sort();
  let cursor=new Date(`${date}T12:00:00Z`), streak=0;
  if(!completed.includes(date)) cursor.setUTCDate(cursor.getUTCDate()-1);
  while(completed.includes(cursor.toISOString().slice(0,10))) {streak++;cursor.setUTCDate(cursor.getUTCDate()-1);}
  return {played:completed.length,streak};
}
