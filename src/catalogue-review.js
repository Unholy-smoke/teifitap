import { Map, Marker, NavigationControl, setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'maplibre-gl/dist/maplibre-gl.css';
import './catalogue-review.css';
import original from '../data/location-catalogue.json';
import { applyEdits, readEdits, editableFields, validateEdit, CATALOGUE_KEY } from './catalogue-store.js';
import { bounds, clampCentre, mapStyle } from './map-style.js';
import { cameraOptions, limitZoomToArea } from './map-camera.js';
setWorkerUrl(workerUrl);
let edits = {}; try { edits = readEdits(localStorage); } catch { /* export still works */ }
let catalogue = applyEdits(original,edits), index=0, dirty=false, storageFailed=false, downloadUrl;
const escape = text => text.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const select = document.querySelector('#place'), status=document.querySelector('#save-status');
const map = new Map({container:'map', style:mapStyle, ...cameraOptions});
limitZoomToArea(map);map.touchZoomRotate.disableRotation();
map.addControl(new NavigationControl({showCompass:false}));
map.on('error', () => {document.querySelector('#map-error').hidden=false;});
const marker = new Marker({color:'#ac583b',draggable:true});
function options() {
  select.innerHTML=catalogue.places.map((p,i)=>`<option value="${i}">${i+1}. ${escape(p.en.name)} · ${p.difficulty}${edits[p.id] ? ' *' : ''}</option>`).join('');
  select.value=String(index);
}
function savedMessage() { status.textContent=storageFailed ? 'Changes are in this tab only. Download the JSON to keep them.' : `Saved in this browser · ${Object.keys(edits).length} edited places. Download JSON to share or publish them.`; }
function markDirty(){dirty=true;status.textContent='Unsaved changes. Save this place, or move to another place to save it.';}
function saveCurrent() {
  if(!dirty)return true;
  const form=document.querySelector('#edit-place');
  if(!form.reportValidity())return false;
  const values=new FormData(form), p=catalogue.places[index];
  const edit={difficulty:Number(values.get('difficulty')),coord:[Number(values.get('longitude')),Number(values.get('latitude'))]};
  for(const lang of ['en','cy'])edit[lang]=Object.fromEntries(['name','town','fact'].map(field=>[field,values.get(`${lang}-${field}`).trim()]));
  const error=validateEdit(edit);if(error){status.textContent=error;return false;}
  const nextEdits={...edits,[p.id]:editableFields(edit)}, next=applyEdits(original,nextEdits);
  if([1,2,3].some(d=>!next.places.some(place=>place.difficulty===d))){status.textContent='Keep at least one place at each difficulty so practice games can run.';return false;}
  edits=nextEdits;catalogue=next;
  try {localStorage.setItem(CATALOGUE_KEY,JSON.stringify(edits));storageFailed=false;} catch {storageFailed=true;}
  dirty=false;options();marker.setLngLat(edit.coord);savedMessage();return true;
}
function coordinates(coord) {
  const point=clampCentre(coord).map(x=>Number(x.toFixed(7)));
  document.querySelector('#longitude').value=point[0];document.querySelector('#latitude').value=point[1];
  marker.setLngLat(point);markDirty();
}
marker.on('dragend',()=>coordinates(marker.getLngLat().toArray()));
map.on('click',e=>coordinates(e.lngLat.toArray()));
function show(value) {
  if(!saveCurrent()){select.value=String(index);return;}
  index=(value+catalogue.places.length)%catalogue.places.length;
  options();const p=catalogue.places[index];
  document.querySelector('#position').textContent=`${index+1} / ${catalogue.places.length}`;
  const languages=['en','cy'].map(lang=>`<fieldset${lang==='cy' ? ' lang="cy"' : ''}><legend>${lang==='en' ? 'English' : 'Cymraeg'}</legend>${['name','town'].map(field=>`<label for="${lang}-${field}">${lang==='cy' ? {name:'Enw',town:'Tref'}[field] : {name:'Place name',town:'Town'}[field]}</label><input id="${lang}-${field}" name="${lang}-${field}" value="${escape(p[lang][field])}" required>`).join('')}<label for="${lang}-fact">${lang==='en' ? 'Fact' : 'Ffaith'}</label><textarea id="${lang}-fact" name="${lang}-fact" rows="4" required>${escape(p[lang].fact)}</textarea></fieldset>`).join('');
  document.querySelector('#details').innerHTML=`<p class="badge">${p.targetType==='area' ? 'Area reference' : 'Point target'} · Research draft</p><form id="edit-place">${languages}<label for="difficulty">Difficulty</label><select id="difficulty" name="difficulty">${[1,2,3].map(d=>`<option${p.difficulty===d ? ' selected' : ''}>${d}</option>`).join('')}</select><p class="small">Drag the pin or tap the map to change the location.</p><div class="coordinate-fields"><div><label for="longitude">Longitude</label><input id="longitude" name="longitude" type="number" step="any" min="${bounds[0][0]}" max="${bounds[1][0]}" value="${p.coord[0]}" required></div><div><label for="latitude">Latitude</label><input id="latitude" name="latitude" type="number" step="any" min="${bounds[0][1]}" max="${bounds[1][1]}" value="${p.coord[1]}" required></div></div><button class="save" type="submit">Save this place</button></form><p class="note">${escape(p.reviewNotes)}</p><p><a href="${escape(p.source)}" target="_blank" rel="noopener">Fact source ↗</a> · <a href="${escape(p.coordinateSource)}" target="_blank" rel="noopener">Original coordinate source ↗</a></p>`;
  const form=document.querySelector('#edit-place');form.addEventListener('input',markDirty);form.addEventListener('change',markDirty);
  form.addEventListener('submit',e=>{e.preventDefault();if(saveCurrent())map.jumpTo({center:catalogue.places[index].coord});});
  marker.setLngLat(p.coord).addTo(map);map.jumpTo({center:p.coord,zoom:p.targetType==='area' ? 14 : 16});
}
select.addEventListener('change',()=>show(Number(select.value)));
document.querySelector('#previous').addEventListener('click',()=>show(index-1));
document.querySelector('#next').addEventListener('click',()=>show(index+1));
document.querySelector('#whole').addEventListener('click',()=>map.fitBounds(bounds,{padding:25,duration:0}));
document.querySelector('#download').addEventListener('click',e=>{
  if(!saveCurrent()){e.preventDefault();return;}
  if(downloadUrl)URL.revokeObjectURL(downloadUrl);
  downloadUrl=URL.createObjectURL(new Blob([JSON.stringify({...catalogue,exportedAt:new Date().toISOString()},null,2)+'\n'],{type:'application/json'}));
  e.currentTarget.href=downloadUrl;
});
window.addEventListener('beforeunload',e=>{if(dirty||storageFailed){e.preventDefault();e.returnValue='';}});
show(0);if(Object.keys(edits).length)savedMessage();
