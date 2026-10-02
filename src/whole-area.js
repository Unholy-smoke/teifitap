import { bounds } from './map-style.js';

const mercatorY = lat => (1 - Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)) / Math.PI) / 2;
export function wholeAreaView(width, height, padding = 25) {
  const [[west, south], [east, north]] = bounds;
  const top = mercatorY(north), bottom = mercatorY(south);
  const scale = Math.min(Math.max(1, width - 2 * padding) / ((east - west) / 360), Math.max(1, height - 2 * padding) / (bottom - top));
  return {
    center: [(west + east) / 2, Math.atan(Math.sinh(Math.PI * (1 - top - bottom))) * 180 / Math.PI],
    zoom: Math.max(0, Math.min(18, Math.log2(scale / 512))),
  };
}
