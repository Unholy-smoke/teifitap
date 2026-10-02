import fs from 'node:fs';
const [date,...ids]=process.argv.slice(2);
const path='data/daily-schedule.json', schedule=JSON.parse(fs.readFileSync(path,'utf8')), catalogue=JSON.parse(fs.readFileSync('data/location-catalogue.json','utf8'));
const next=new Date(`${schedule.days.at(-1).date}T12:00:00Z`);next.setUTCDate(next.getUTCDate()+1);
if(date!==next.toISOString().slice(0,10)||ids.length!==3)throw Error(`Usage: node scripts/add-daily.js ${next.toISOString().slice(0,10)} EASY_ID MEDIUM_ID HARD_ID`);
const used=new Set(schedule.days.flatMap(d=>d.places.map(p=>p.id)));
const places=ids.map((id,i)=>{
 const place=catalogue.places.find(p=>p.id===id);
 if(!place||place.difficulty!==i+1||place.targetType!=='point'||used.has(id))throw Error(`Invalid, wrong-difficulty, area or already-used target: ${id}`);
 return structuredClone(place);
});
schedule.days.push({date,places});fs.writeFileSync(path,JSON.stringify(schedule,null,2)+'\n');
console.log(`Added ${date}. Existing dates and used locations preserved. Run tests and publish.`);
