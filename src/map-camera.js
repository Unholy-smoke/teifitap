import { LngLat } from 'maplibre-gl';
import { clampCentre, home } from './map-style.js';
import { wholeAreaView } from './whole-area.js';
export const cameraOptions = {
  ...home, minZoom: 11, maxZoom: 18, pitch: 0, bearing: 0, maxPitch: 0,
  dragRotate: false, pitchWithRotate: false, touchPitch: false,
  transformConstrain: (centre, zoom) => ({ center: new LngLat(...clampCentre([centre.lng, centre.lat])), zoom }),
};

// Custom centre constraints replace MapLibre's normal zoom constraints too.
// Keep both limits explicit, and recalculate the whole-area floor on resize.
export function limitZoomToArea(map) {
  let floor = 0;
  map.setTransformConstrain((centre, zoom) => ({
    center: new LngLat(...clampCentre([centre.lng, centre.lat])),
    zoom: Math.max(floor, Math.min(18, zoom)),
  }));
  const update = () => {
    const canvas = map.getCanvas();
    floor = wholeAreaView(canvas.clientWidth, canvas.clientHeight).zoom;
    if (Math.abs(map.getMinZoom() - floor) > 1e-8) map.setMinZoom(floor);
  };
  update();
  map.on('resize', update);
}
