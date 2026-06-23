import { Paths } from "./path";

export const LIVE_VIEW_TYPES = {
  live: "live",
  prematch: "prematch",
};

export function getLiveViewType(search) {
  const params =
    search instanceof URLSearchParams ? search : new URLSearchParams(search);

  return params.get("viewType") === LIVE_VIEW_TYPES.prematch
    ? LIVE_VIEW_TYPES.prematch
    : LIVE_VIEW_TYPES.live;
}

export function getLiveRoute(path, viewType = LIVE_VIEW_TYPES.live) {
  return path + "?viewType=" + viewType;
}

export const LIVE_NAV_ITEMS = {
  live: [
    { label: "Event View", href: getLiveRoute(Paths.eventView), viewType: LIVE_VIEW_TYPES.live },
    { label: "Live Calendar", href: getLiveRoute(Paths.liveCalendar), viewType: LIVE_VIEW_TYPES.live },
    { label: "Results", href: getLiveRoute(Paths.results), viewType: LIVE_VIEW_TYPES.live },
    { label: "Statistics", href: getLiveRoute(Paths.statistics), viewType: LIVE_VIEW_TYPES.live },
  ],
  prematch: [
    { label: "Event View", href: getLiveRoute(Paths.eventView, LIVE_VIEW_TYPES.prematch), viewType: LIVE_VIEW_TYPES.prematch },
    { label: "Live Calendar", href: getLiveRoute(Paths.liveCalendar, LIVE_VIEW_TYPES.prematch), viewType: LIVE_VIEW_TYPES.prematch },
    { label: "Results", href: getLiveRoute(Paths.results, LIVE_VIEW_TYPES.prematch), viewType: LIVE_VIEW_TYPES.prematch },
    { label: "Statistics", href: getLiveRoute(Paths.statistics, LIVE_VIEW_TYPES.prematch), viewType: LIVE_VIEW_TYPES.prematch },
  ],
};