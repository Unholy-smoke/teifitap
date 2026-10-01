export const bounds = [[-4.725, 52.044], [-4.61, 52.133]];
export const home = { center: [-4.666, 52.087], zoom: 12.65 };
// Limit the guessed point, never the viewport rectangle. Edge locations remain reachable.
export function clampCentre([lng, lat]) {
  return [Math.max(bounds[0][0], Math.min(bounds[1][0], lng)), Math.max(bounds[0][1], Math.min(bounds[1][1], lat))];
}
// Explicit geometry-only style: no symbols, sprites, labels, buildings or POI layers.
export const mapStyle = {
  version: 8,
  sources: { geography: { type: 'vector', url: 'https://tiles.openfreemap.org/planet', attribution: '<a href="https://openfreemap.org/" target="_blank">OpenFreeMap</a> · <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> · <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a>' } },
  layers: [
    { id: 'paper', type: 'background', paint: { 'background-color': '#eee8d9' } },
    { id: 'water', type: 'fill', source: 'geography', 'source-layer': 'water', paint: { 'fill-color': '#9fbfbc' } },
    { id: 'streams', type: 'line', source: 'geography', 'source-layer': 'waterway', paint: { 'line-color': '#9fbfbc', 'line-width': ['interpolate', ['linear'], ['zoom'], 11, 1, 17, 5] } },
    { id: 'road-edge', type: 'line', source: 'geography', 'source-layer': 'transportation', filter: ['!in', 'class', 'rail', 'ferry', 'path', 'track', 'transit', 'service'], layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#898579', 'line-width': ['interpolate', ['exponential', 1.45], ['zoom'], 10, 1, 14, 3.5, 18, 16] } },
    { id: 'road-fill', type: 'line', source: 'geography', 'source-layer': 'transportation', filter: ['!in', 'class', 'rail', 'ferry', 'path', 'track', 'transit', 'service'], layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#fffaf0', 'line-width': ['interpolate', ['exponential', 1.45], ['zoom'], 10, 0.3, 14, 2, 18, 12] } },
    { id: 'minor-lanes', type: 'line', source: 'geography', 'source-layer': 'transportation', minzoom: 13, filter: ['in', 'class', 'service', 'track'], paint: { 'line-color': '#b6afa0', 'line-width': ['interpolate', ['linear'], ['zoom'], 13, 0.7, 18, 3] } },
    { id: 'paths', type: 'line', source: 'geography', 'source-layer': 'transportation', minzoom: 15, filter: ['==', 'class', 'path'], paint: { 'line-color': '#b6afa0', 'line-width': 1, 'line-dasharray': [2, 2] } },
  ],
};
