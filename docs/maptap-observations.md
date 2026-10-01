# MapTap reference play-through

Observed hands-on at https://maptap.gg/ on 1 October 2026, puzzle #832. Completed the tutorial and all five daily rounds in the in-app browser. This is an observation of that session, not a claim about every puzzle or the underlying implementation.

## First visit and tutorial

- Opens directly onto an interactive globe, with a compact header containing Menu, puzzle number and date.
- Running total appears prominently at top left, padded to three digits at the start (000).
- Initial overlay asks the player to rotate the globe. Dragging advances the tutorial.
- Tutorial asks for New York City and explicitly mentions zooming for precision.
- Tapping the globe submits immediately; no confirmation or pin-adjustment stage was observed in the default mode.
- Guess and target are marked, the view animates towards the answer, and distance and points appear.
- One tutorial attempt returned 468 km / 90 points. The main score remained 000, so practice did not count towards the daily total.
- Completion explains that each day has five new locations, with a Let's Go button.
- Mouse activation of several HTML controls did not take effect through this browser automation; focusing the actual button and pressing Enter worked. This is a test-environment observation, not a diagnosed site defect. Reloading before tutorial completion restarted the tutorial.

## Daily round sequence

| Round | Named target | Difficulty | Multiplier | Running total after guess | Points added |
| --- | --- | --- | --- | --- | --- |
| 1 | Kagoshima, Japan | Easy | 1x | 85 | 85 |
| 2 | Caen, France | Easy | 1x | 174 | 89 |
| 3 | Cagliari, Sardinia, Italy | Medium | 2x | 348 | 174 |
| 4 | Juba, South Sudan | Hard | 3x | 582 | 234 |
| 5 | Ciudad del Este, Paraguay | Hard | 3x | 834 | 252 |

Points added are calculated from the observed cumulative totals. The round-three base score of 87 is inferred from 174 / 2. Do not infer the complete scoring formula from this small sample.

## Guessing and feedback

- Named city and country/region prompts, rather than photographs or riddles, in this day's set.
- Full-screen geography dominates; compact question panel at the top.
- Satellite-like land texture, blue sea, recognisable coasts and terrain, with no normal place-name labels while guessing.
- Drag rotates the globe. Mouse-wheel zoom visibly enlarges it.
- No visible countdown during this play-through; this does not prove there are no timing rules elsewhere.
- Immediate guess feedback can identify a wrong country (observed Spain, Sudan and Bolivia).
- Reveal animates to the answer, showing guess and answer markers and a visual connector; country highlighting was visible after the first answer.
- The reveal displays target name, country flag, distance in km, base score and multiplier where applicable.
- Examples: Kagoshima 737 km / 85; Juba 1,311 km / 78 (x3); Ciudad del Este 830 km / 84 (x3).
- Juba also displayed a +3 right-continent annotation. The total increased by 78 x 3 = 234; the exact relationship between that annotation and the base score was not determined.
- Occasional population/context facts and humorous reaction text accompany results.
- The next round starts automatically after the reveal; no Next button was required.
- The next round begins with the globe near the previous reveal, rather than resetting to one starting view.
- Difficulty strip changes colour: green for Easy, yellow for Medium, orange/red for the Hard rounds. Text also states difficulty and multiplier.

## End of daily game

- Finished at 834 points; score remains visible.
- Reloading after completion restored the 834 score and finished review screen, rather than offering another daily attempt. This verifies completed-game persistence in the same browser session only.
- Saved reference screenshot: completed game (kept locally; third-party screenshot not published).
- Share your score button appears. Keyboard activation produced a Score copied to Clipboard confirmation. The browser clipboard API returned no text, so the precise share format was not verified. No score was sent to another person or service through a share destination.
- First completion triggers a Day One achievement; using share/menu also triggered achievements.
- Globe becomes a review/story surface: the first location showed round number, score percentage, distance and a long editorial story with an image/source panel above.
- Article/story link and Play audio control were visible; external article and playback were not tested.
- A separate 94 / arrow badge was visible and changed to 95 after refresh, but its meaning was not established and should not be labelled a percentile or rank without further evidence.

## Other exposed features (links only, not played)

Menu lists Home, Prior Days & Best of MapTap, Practice Levels, Player-Made Levels, Atlas, MapTap+, Profile, Favourite Stories, Groups, Versus, Donate and Settings.

Settings exposes sections for Tap Adjustments, Game, Accessibility, Advanced, Account and About. Language and date formatting controls were visible. Version shown: v9.30.2026. No setting was changed.

The menu means past/practice play may be available, but availability, payment requirements and rules were not explored. Only today's daily set was completed.

## Subsequent owner-supplied evidence

On 1 October 2026 the owner supplied mobile screenshots verifying native text sharing and the score/emoji message format. See [share reference](share-reference.md). The owner also confirmed the five-round weighting is fixed across days. The observations above preserve what was and was not established in the original desktop session.

## Still unverified in the original desktop session

- Exact distance-to-score function, full-mark threshold, bonus rules and maximum total.
- Whether this difficulty pattern is fixed for every day.
- Share text, leaderboard/group behaviour, streak rules and archive access conditions.
- Mobile touch behaviour, accessibility detail, reduced motion and screen-reader support.
- Daily timezone/rollover, mid-game recovery and cross-device syncing.

## Lessons for CardiTap

Keep the short daily ritual, five shared targets, geographical deduction, satisfying answer reveal and a shareable result. Local factual snippets can add personality after each answer.

Adapt the scale and input: metres rather than world-scale kilometres; a north-up local map; adjustable pin plus explicit confirmation; a readable reveal with player-controlled Next. A restrained antique palette fits Cardigan better than copying the neon space treatment. Treat these as proposals awaiting discussion.
