# TeifiTap development brief

Updated 1 October 2026 following the owner's answers and mobile sharing screenshots. TeifiTap is the preferred working title, previously CardiTap. Keep the existing workspace folder name.

## Agreed product direction

A browser-based daily local geography game for friends and family. Use a flat, north-up map of Cardigan and its environs, extending to St Dogmaels, the Cliff Hotel at Gwbert, and Cilgerran. Exact bounds will be refined through play.

Keep accurate modern roads, river and coastline; hide all map names and POI symbols at every zoom. Start with these geographic features rather than recognisable landmark illustrations. Building footprints and terrain can be evaluated later. Give the map restrained antique character: ivory ground, ink roads and muted blue-green water, with modern, legible controls.

The pin stays at the centre of the map viewport. Players drag the map beneath it and zoom for precision, then press Confirm. The submitted coordinate must be the map coordinate under the pin tip, including when mobile panels resize. No timer.

Prompts simply name the place and settlement, such as Rugby Club, Cardigan or The Abbey, St Dogs. Provide bilingual English/Welsh interface and content, retaining proper Welsh names where appropriate. Occasional less familiar Welsh names are welcome. Proposed presentation: a language toggle with bilingual place names where helpful; owner review of Welsh wording before release.

After each guess, reveal the true location, connecting line, distance in metres and points, followed by a factual snippet and an accompanying image. Research the facts and use images with documented permission/licence and attribution. Proposed Next button lets players enjoy the reward at their own pace.

Everyone receives the same daily set, resetting at midnight Europe/London, including daylight-saving changes. Persist progress and completed results. Proposed interrupted-game rule: retain the original puzzle date until that game finishes; then offer the new day's puzzle if available.

## Daily rounds and difficulty

Confirmed by the owner: three rounds per day, weighted 1x, 2x and 3x. Start with a five-place test pool and expand it later. Keep round configuration separate from content pool size. No duplicate target within a daily set.

The owner confirms MapTap's own five-round weights are fixed at 1x, 1x, 2x, 3x and 3x every day. TeifiTap adapts that progression to three rounds. The owner will help classify locations by difficulty. Five seed places are enough to test the mechanics, not to provide sustained daily variety.

## Scoring

Use distance-based local scoring, with a forgiving full-mark tolerance to be calibrated on phones. Exact formula, tolerance and treatment of large sites remain design decisions. Separate base score, multiplier and future bonuses in the data model and result display.

Version 0.5 target: a right-street bonus analogous to MapTap's right-country bonus. Model this as an accepted street segment or set associated with the target, rather than simply comparing nearest street names. Junctions, parallel roads, opposite river banks and unnamed access roads need explicit handling. Street identity stays hidden during guessing and can be disclosed after confirmation. No bonus amount has been agreed.

## Sharing

Use the phone's native OS share sheet for a compact spoiler-free text result, with a copy-text fallback where native sharing is unavailable. No leaderboard or account flow is required for the initial version.

The owner's mobile screenshots verify a native Sharing text sheet and the plain-text payload: title, website plus date, a single line of numeric round scores each paired with an emoji, then Final score. Use that compact convention for three rounds. Never include target names or answer coordinates. This is plain text, not a generated share image.

The screenshot shows round values 86, 96, 88, 77 and 29 with total 676. These are unweighted round values: 86 + 96 + 88*2 + 77*3 + 29*3 = 676. TeifiTap should likewise share base round scores and a weighted final total. Emojis supplement the numbers, rather than replace them. The screenshot alone does not establish MapTap's complete emoji thresholds; define a consistent TeifiTap mapping during implementation.

Illustrative TeifiTap format (not a real game result):

```text
TeifiTap · 1 October 2026
96🔥 88🎉 77🤗
Final score: 503
[game URL]
```

Here 96 + 88*2 + 77*3 = 503. Replace the URL placeholder with the actual deployed game address; no domain is selected. Localise the date and final-score label for the selected language. Both Share and Copy must use the same generated text. See share-reference.md for the supplied evidence.

Implementation reference: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share . Native sharing requires supported browsers, HTTPS and a user gesture. Cancelling the sheet is not an error and must not trigger an unsolicited fallback action. Provide a separate Copy button. Do not claim a message was sent just because a share sheet opened.

## Starter content

Begin with five reasonably easy, varied locations; expand after the map and game feel are established. The proposed starter candidates and official sources are in starter-locations.md. These are a convenience sample for testing, not yet a verified coordinate dataset or genuinely random selection. No difficulty labels are final.

Each record needs a stable ID, English/Welsh name and settlement, category, coordinate or accepted area, difficulty, fact in both languages, source links, image asset and credit/licence, verification date and future street identifiers. Review closed/renamed businesses. Keep daily selection deterministic and independent of language/device. Avoid repeating a target until the available pool in that difficulty tier requires it.

## First playable scope

1. Accurate unlabelled local map, constrained pan/zoom and fixed centre pin.
2. Five reviewed seed records; three daily rounds weighted 1x, 2x and 3x.
3. Named bilingual prompts, explicit confirmation, distance scoring and multipliers.
4. Fact/image reward, round breakdown and native share/copy result.
5. Local persistence, shared daily schedule and UK midnight rollover.
6. A simple content file to maintain initially; no administration screen required yet.

Choose a map library/data source only after checking current attribution, tile-use terms and cost. Existing online hosting is available but its capabilities are unknown; prefer a portable build. Domain interest: carditap.gg, availability and price not verified. No purchase authorised.

## Acceptance gates

- Real map preview includes all agreed outer locations with sensible margins.
- No labels, POI icons, search or popups reveal answers at any zoom.
- The centre pin tip and submitted coordinate agree after pan, zoom and viewport resize.
- Dragging and pinching cannot submit; confirmation locks exactly once.
- Distances and scoring behave sensibly near sites, across the river and at map edges.
- Every target coordinate, fact and photo source is checked; Welsh content reviewed.
- Phone and desktop play-through, readable reward cards, reduced motion and non-colour-only feedback.
- Native share on a real phone, cancellation and copy fallback tested separately.
- Refresh/resume, daily completion lock and UK midnight/DST behaviour verified.
- Map/image attribution and hosting costs understood before publishing.

## Remaining decisions

Round count and weights are settled: three at 1x, 2x and 3x.

Can be refined in the prototype: exact bounds, scoring tolerance, large-site semantics, Welsh presentation, difficulty assignments, map texture and interrupted-game policy.

Before hosting: hosting platform details, domain choice and real-device verification of TeifiTap's native sharing. The reference text format is now verified from owner-supplied screenshots.
