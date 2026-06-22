# Sportsbook Frontend UI Roadmap

This checklist tracks the frontend work needed to make the sportsbook UI feel dense, sober, attractive, and closer to a production sportsbook experience.

## 1. Left Sidebar Hierarchy

- [x] Sport accordion
- [x] Market type filter under sport, for example `Match Result`
- [x] Country/group section
- [x] League/competition section
- [x] Event cards inside league
- [x] League/event count badges
- [ ] Live and prematch counts

Target structure:

```txt
Sport
  Market Type / Primary Filter
    Country or Group
      League
        Events
```

## 2. Compact Event Cards

- [x] League/country label
- [x] Event status/time
- [x] Home/away score for match events
- [x] Main odds row: `W1 / X / W2`
- [x] Market count badge
- [x] Favorite/star icon
- [x] Highlight selected event
- [x] Outright cards should show event name plus top 2-3 runners, not `W1 / X / W2`

## 3. Event Header

- [ ] Sport/league breadcrumb
- [ ] Event name or teams
- [ ] Score/time/status for live matches
- [ ] Outright label for outright events
- [ ] Cleaner background image overlay
- [ ] Remove fake/irrelevant score rows for outrights

## 4. Market Category Tabs

- [x] `All`
- [x] `Match`
- [x] `Handicaps`
- [x] `Totals / Goals`
- [x] `Halves`
- [x] `Outrights`
- [x] Show count per tab
- [x] Filter visible markets by selected tab

Market grouping example:

```txt
h2h       -> Match
spreads   -> Handicaps
totals    -> Totals / Goals
outrights -> Outrights
```

## 5. Dense Market Grid

- [x] Single-column market list on desktop and mobile
- [x] Compact market cards
- [x] Outcomes in grid cells
- [x] Odds highlighted in yellow/accent
- [x] Runner names left, odds right
- [x] Avoid excessive vertical empty space

## 6. Outright Market UI

- [ ] Runner grid/list
- [ ] Search runner
- [ ] Sort top odds first
- [ ] Optional alphabetical sort later
- [ ] Show many selections cleanly
- [ ] No `vs`
- [ ] No scores
- [ ] No `W1 / X / W2`

## 7. Bet Slip Polish

- [ ] Correct event name for outrights
- [ ] Correct runner name
- [ ] Correct market name
- [ ] Correct event date
- [ ] Clear selected odds state
- [ ] Quick stake buttons
- [ ] Disable bet button until valid selection/stake

## 8. Live Odds UX

- [x] Subtle blink on odds movement
- [ ] Optional green/red movement indicator
- [x] No harsh flashing
- [x] Preserve selected market while odds update

## 9. Empty State Handling

- [ ] If no markets, show sober message
- [ ] If waiting for odds, show skeleton/loading rows
- [x] If event has no odds, show `Markets currently unavailable`
- [x] Do not leave large blank panels

## 10. Visual Polish

- [ ] Dark sober sportsbook theme
- [ ] Compact spacing
- [ ] Yellow accent for odds/actions
- [ ] Less giant empty panels
- [ ] Consistent cards/borders/shadows
- [ ] Better typography hierarchy

## 11. Mobile Responsiveness

- [ ] Sidebar collapses properly
- [x] Market cards single column
- [ ] Betslip drawer/modal
- [ ] Sticky selected event header

## 12. Data Mapping Cleanup

- [ ] Frontend should understand event types:

```txt
MATCH
OUTRIGHT
```

- [x] Frontend should understand market display groups:

```txt
h2h       -> Match
spreads   -> Handicaps
totals    -> Totals
outrights -> Outrights
```

## 13. Odds Server Integration

- [x] Sports and events load from the odds-server API
- [x] Legacy market-service polling removed from the event market panel
- [x] WebSocket subscription for configured league keys
- [x] Live odds deltas update the selected event and sidebar winner odds
- [x] Generic market mapping: configured market keys render without frontend hardcoding
- [x] Fake odds mode produces configured market snapshots and rotating development ticks
- [x] Prematch event board groups events by date and filters by selected sport
- [x] Market accordion opens/closes with a smooth slide transition
- [x] Betslip event switch keeps a stable bets-status footprint instead of flashing a loader
## Recommended Implementation Order

1. Left sidebar hierarchy
2. Dense market grid
3. Outright-specific UI
4. Market category tabs
5. Betslip polish
6. Empty states and live odds animation polish
7. Mobile refinement

The biggest visual improvement will come from implementing the sidebar hierarchy and dense market grid first.
