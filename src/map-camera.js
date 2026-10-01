import { LngLat } from 'maplibre-gl';
import { clampCentre, home } from './map-style.js';
export const cameraOptions = {
  ...home, minZoom: 11, maxZoom: 18, pitch: 0, bearing: 0, maxPitch: 0,
  dragRotate: false, pitchWithRotate: false, touchPitch: false,
  transformConstrain: (centre, zoom) => ({ center: new LngLat(...clampCentre([centre.lng, centre.lat])), zoom }),
};
