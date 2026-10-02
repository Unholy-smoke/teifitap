# TeifiTap

A daily geography guessing game for friends and family, set in Cardigan and its environs in west Wales. TeifiTap is the working title, previously CardiTap; the workspace folder remains CardiTap.

## Agreed direction

- Browser based, with eventual online hosting.
- Three shared daily rounds, weighted 1x, 2x and 3x, resetting at midnight UK time.
- Five reasonably easy starter locations for the prototype, expanding the pool later.
- Flat north-up map extending to St Dogmaels, the Cliff Hotel at Gwbert and Cilgerran.
- Fixed centre pin: drag and zoom the map beneath it, then confirm.
- Roads, river and coastline clearly visible; all map names and POI labels hidden.
- Restrained old-fashioned cartography with modern usability.
- Named place-and-town prompts, bilingual English/Welsh content, no timer.
- Increasing difficulty and score multipliers; right-street bonus planned for version 0.5.
- Fact and image after each guess; phone-native score sharing with copy fallback.
- MapTap is the gameplay reference; TeifiTap has its own implementation, local content and visual identity.

## Current stage

The minimum playable application runs locally. Three daily rounds, geometry-only map, fixed centre pin, English/Welsh toggle, short factual rewards, weighted results, copy/native sharing and independent practice mode are implemented. Photos, streaks/history and street bonuses remain later work.

## Online testing

GitHub Pages address: https://unholy-smoke.github.io/teifitap/

The Pages workflow tests and builds the app on each push to main, then publishes only dist/. In repository Settings → Pages, select GitHub Actions as the source. Browser progress is stored separately for the online site and localhost.

## Local development

Requires Node.js (tested with 24.12).

```sh
npm install
npm run dev
```

Open http://localhost:5173 . To test on a phone on the same home network, use the Network URL printed by Vite. This development server is bound to local network interfaces; it has not been deployed online. Do not expose the development server to the public internet.

The map tiles and optional web fonts need internet access. Native phone sharing usually needs HTTPS; on a plain HTTP local-network address, use Copy result or the selectable text fallback. Today’s results persist in this browser using local storage. Practice leaves them untouched. The help dialog has a development-only Restart today's local test button for repeat testing.

```sh
npm test
npm run build
```

The production build is in dist/. No account, API key or backend is needed for this version. Seven unit tests cover dates/DST, scoring, saved-state validation, round flow, deterministic selection and map constraints. Open /test/map-boundaries.html on the development server for a real MapLibre geometry regression covering target/corner reachability across zoom levels and viewport dimensions.

Open /test/mobile-gestures.html at a phone-sized viewport for the touch regression. It sends continuous one-finger drag and two-finger pinch events through the real app, checks movement across successive frames, and rejects map resizing during either gesture. This browser test supplements physical-phone testing.

## Map and content

MapLibre renders OpenFreeMap vector tiles with an authored geometry-only style. Roads and waterways are included; names, POIs, building footprints and landmark-specific fills are not loaded as style layers. Required map attribution remains visible. The camera constrains its centre to the playable bounds, allowing the viewport to extend beyond them so edge targets stay reachable.

Starter coordinates are sourced site-centre points, not entrances; difficulty and Welsh wording are provisional for owner review. Full marks within 50 m, then a 500 m score half-life. These rules are deliberately easy to tune in src/game.js. See [implementation notes](docs/implementation.md).

See [reference observations](docs/maptap-observations.md), [development brief](docs/development-brief.md) and [starter candidates](docs/starter-locations.md).
