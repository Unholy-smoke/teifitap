# TeifiTap minimum playable version

Initially implemented 1 October 2026. Static Vite application, vanilla JavaScript and MapLibre GL JS. Dependencies locked in package-lock.json. Local development server: port 5173. Public testing on GitHub Pages.

## 2 October: expanded catalogue and zoom limits

Subsequent update: catalogue practice now selects one location at each of difficulties 1, 2 and 3 using a fresh random seed; all 33 drafts are available for practice only. Practice can be entered from any daily phase and leaves daily progress untouched. Area scoring still uses the provisional reference centre, with a visible note.

The review page is now an editor. A validated per-record patch in `teifitap.catalogue-edits.v1` stores English/Welsh names, towns, facts, coordinates and difficulty. Navigating saves valid changes; invalid forms stay open. Pin dragging/map taps change coordinates within the existing bounds. Save errors leave changes in memory and point the user to JSON export. Exports contain the full catalogue with edits. New practice games read those edits. Publishing remains an explicit file update; browser storage is not a shared backend.

The 33 owner-supplied candidates are stored in `data/location-catalogue.json`, with difficulties 1–3, bilingual draft facts, source links, reference coordinates, target types and review notes. They remain separate from the five active starter targets until pins and area scoring are reviewed. `scripts/render-catalogue.js` generates the Markdown companion. The deployed `/catalogue.html` page steps through each pin and fact without changing game progress; it contains answers and is not linked from the game.

The owner confirmed Teifi Boating Club at difficulty 2, Banc-y-Warren as the summit, and Pont y Cleifion as the A487 bypass bridge (mapped as Priory Bridge). All catalogue reference points, including Penparc, fit the existing bounds. Villages, estate, club grounds and quarry need accepted polygons: their single reference points must not become precise scoring targets.

`limitZoomToArea` sets the minimum zoom from the map canvas dimensions and Mercator bounds, with 25 px padding. It recalculates on MapLibre resize and enforces both zoom limits inside the custom centre constraint. Browser regression verifies the whole-area view, 108 edge/target combinations and the zoom-in ceiling. Mobile touch regression continues to require sustained pan/pinch events and no gesture-triggered resizes.

## Map strategy

OpenFreeMap serves OpenStreetMap-derived vector tiles using the OpenMapTiles schema. The published service currently requires no account/API key and supports customised styles. Sources: https://openfreemap.org/ and https://openfreemap.org/quick_start/ . Our own src/map-style.js includes only water, waterways, roads, service lanes/tracks and higher-zoom paths. There are no symbol layers, place labels, buildings or POI categories, so no labels appear at higher zoom levels. Attribution is retained.

The initial maxBounds implementation incorrectly restricted the visible map rectangle, preventing the fixed pin from reaching outer targets. Replaced with MapLibre's transformConstrain, restricting only the camera centre. Geography may extend beyond the playable rectangle, but the pin stays inside it. All four corners and each target can be centred at any supported zoom. Reference: https://maplibre.org/maplibre-gl-js/docs/examples/customize-the-map-transform-constrain/ .

Bounds: west -4.725, east -4.610, south 52.044, north 52.133. Initial centre -4.666, 52.087. North-up, no rotation/tilt, zoom 11–18. Bounds can be refined after playtesting. No self-hosted tiles/offline package yet; tile-service availability remains an external dependency.

## Gameplay and storage

- Three targets, base score 0–100, multipliers 1/2/3; maximum 600.
- Great-circle straight-line distance; full score at up to 50 m; beyond this, score halves each additional 500 m, rounded to an integer.
- Confirmation locks a guess; reveal displays both markers, connecting line, distance and a sourced short fact. Photos are deferred.
- Date uses Europe/London, independent of device timezone; Welsh dates use an explicit month list because browser locale support varies.
- Deterministic target selection from five places, then sorted by provisional difficulty. This small pool is not balanced into fixed difficulty tiers yet.
- Same-browser local storage key teifitap.daily.v1. Reload restores a reveal or completed result. An unfinished older daily puzzle can be finished; a visible button offers today's puzzle. No streak/history yet.
- Practice is separate and does not overwrite daily state. Practice is not persisted across reloads.
- Plain-text native sharing when available; copy and selectable-text fallback. Share cancellation is silent. Mobile LAN HTTP does not provide the secure context normally needed for native sharing.
- English/Welsh interface, facts and prompts. Welsh prose and difficulty assignments need a local review.

## Content provenance and accuracy

See src/places.js for per-record source and coordinate links. Five points are Cardigan Castle, St Dogmaels Abbey, Cliff Hotel, Cilgerran Castle and Mwldan. Cardigan Castle, Abbey and Cliff points derive from their mapped OSM features, checked through published map records; Mwldan uses Wikidata Q39011525. Cilgerran uses the published castle coordinate. These are provisional site-centre answers, not surveyed entrance points; review the markers locally before public release. Current facts are short paraphrases of the linked venue/Cadw sources.

## Validation and known limits

- Unit tests: UK midnight and both daylight-saving transitions; distance sanity/monotonic score; deterministic distinct selection; one submission per round; weighted totals; saved-state checks; spoiler-free share text; map layer exclusions; centre constraints.
- Browser: completed three-round flow, restored reveal after refresh, English/Welsh switch, result/copy confirmation, practice mode and map dragging. DOM measurement confirms pin tip at map centre and no horizontal overflow at phone size.
- Browser regression harness: 108 combinations of five targets plus four corners, four zoom levels and three viewport dimensions; includes the two previously unreachable targets. Uses the same camera configuration as the application.
- Desktop and 390×844 responsive screenshots checked. This is browser viewport testing, not a physical iOS/Android device test. Native mobile sharing and pinch behaviour need real-phone confirmation.
- Production build succeeds; MapLibre produces a large-bundle advisory. No attempt to disguise the map library's size.
- Loading failure offers Retry; guesses are disabled until the current map tiles are ready.
- Initial dependency install reported no audit vulnerabilities. No authentication or anti-cheat: answer data is client-side, acceptable for this family prototype.
- Vite file watching uses polling because the shared Windows workspace initially served stale modules after an edit.

## Next work, in order

1. Owner playtest of map extent, phone controls, point accuracy and score generosity.
2. Refine Welsh wording and difficulty classifications; expand the location pool.
3. Add sourced/licensed photo rewards.
4. Same-browser result history and streaks: key by UK puzzle date, update once on daily completion, ignore practice, preserve across refresh and schema migration, and test missed days/DST. No account needed.
5. Right-street bonus (version 0.5): accepted street segments, not nearest-name heuristics.
6. HTTPS hosting and real-device native sharing.

## Family launch, 2 October 2026

Published `data/daily-schedule.json` freezes seven daily puzzles, with distinct point IDs across the entire schedule, one at each difficulty. This ledger, rather than individual players’ storage, prevents repeat allocation and preserves shared puzzles. Extend by appending unused IDs and retaining past records. When dates run out, retain the final dated puzzle and show an explicit notice; never silently recycle.

`src/daily.js` validates date-indexed browser history against the schedule and derives completed-day count and current streak. The launch key is separate from earlier test storage. Practice reads local catalogue edits and never writes daily history. Scheduled daily prompts use frozen published snapshots, unaffected by draft edits. No cross-device accounts or result-history browsing UI yet.
