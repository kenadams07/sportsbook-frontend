import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Check,
  CheckCircle2,
  Database,
  Filter,
  Layers3,
  ListChecks,
  Loader2,
  RefreshCw,
  Search,
  ServerCog,
  ShieldCheck,
  Trophy,
  X,
} from 'lucide-react';

import { api } from '../../services/api';
import { Badge } from '../../components/shadcn-ui/badge';
import { Button } from '../../components/shadcn-ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/shadcn-ui/card';
import { Checkbox } from '../../components/shadcn-ui/checkbox';
import { EmptyState } from '../../components/shadcn-ui/empty-state';
import { Input } from '../../components/shadcn-ui/input';
import { Progress } from '../../components/shadcn-ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/shadcn-ui/select';
import { Separator } from '../../components/shadcn-ui/separator';
import { Skeleton } from '../../components/shadcn-ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/shadcn-ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/shadcn-ui/tooltip';

const DEFAULT_REGIONS = 'us';
const DEFAULT_MARKETS = 'h2h';
const DEFAULT_INTERVAL = '30000';
const EASE_OUT_QUART = [0.25, 1, 0.5, 1];

const REGION_OPTIONS = [
  { value: 'us', label: 'United States' },
  { value: 'us2', label: 'United States 2' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'eu', label: 'Europe' },
  { value: 'au', label: 'Australia' },
];

const MARKET_OPTIONS = [
  { value: 'h2h', label: 'Match Odds / H2H' },
  { value: 'spreads', label: 'Spreads' },
  { value: 'totals', label: 'Totals' },
  { value: 'outrights', label: 'Outrights / Futures' },
];

const SUPPORTED_RESTORE_MARKETS = new Set(MARKET_OPTIONS.map((market) => market.value));

const STATUS_OPTIONS = ['', 'PRE_MATCH', 'LIVE', 'SETTLED', 'POSTPONED', 'CANCELLED'];
const primaryActionButton =
  'h-10 rounded-md border-2 border-[#0f1d2f] bg-[#283A55] px-4 font-semibold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18),0_8px_18px_-12px_rgba(40,58,85,0.85)] ring-1 ring-[#0f1d2f]/30 hover:border-[#07111f] hover:bg-[#344b6b] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.24),0_10px_22px_-14px_rgba(40,58,85,0.9)] active:translate-y-px focus-visible:ring-2 focus-visible:ring-[#283A55]/35';
const secondaryActionButton =
  'h-10 rounded-md border-2 border-[#283A55]/70 bg-white px-4 font-semibold text-[#283A55] shadow-[inset_0_0_0_1px_rgba(40,58,85,0.08),0_6px_16px_-13px_rgba(40,58,85,0.8)] ring-1 ring-[#283A55]/15 hover:border-[#1f2f47] hover:bg-[#283A55]/6 hover:text-[#1f2f47] active:translate-y-px focus-visible:ring-2 focus-visible:ring-[#283A55]/25';
const selectControl =
  'h-10 rounded-md border-2 border-[#283A55]/55 bg-white text-foreground shadow-[inset_0_0_0_1px_rgba(40,58,85,0.08),0_1px_2px_rgba(15,23,42,0.06)] ring-1 ring-[#283A55]/10 hover:border-[#283A55]/75 focus-visible:border-[#1f2f47] focus-visible:ring-2 focus-visible:ring-[#283A55]/25';
const nativeScrollArea = 'overflow-auto overscroll-contain rounded-lg border border-border';

function normalizeSport(sport) {
  return {
    key: sport.key,
    group: sport.group,
    title: sport.title,
    description: sport.description || '',
    active: sport.active ?? true,
    hasOutrights: sport.hasOutrights ?? sport.has_outrights ?? false,
  };
}

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function panelMotion(reduceMotion) {
  return {
    initial: reduceMotion ? false : { opacity: 0, transform: 'translateY(8px)' },
    animate: { opacity: 1, transform: 'translateY(0)' },
    transition: { duration: reduceMotion ? 0 : 0.2, ease: EASE_OUT_QUART },
  };
}

function formatDate(value) {
  if (!value) return 'No start time';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Invalid date';
  return date.toLocaleString();
}

function GlassCard({ children, className, ...props }) {
  return (
    <Card
      className={cx(
        'border-border/80 bg-card text-card-foreground shadow-[0_10px_28px_-24px_rgba(40,58,85,0.28)]',
        className,
      )}
      {...props}
    >
      {children}
    </Card>
  );
}

function StatBadge({ label, value, tone = 'default' }) {
  const toneClass = {
    default: 'border-border bg-muted/55 text-foreground',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    warning: 'border-amber-200 bg-amber-50 text-amber-700',
  }[tone];

  return (
    <div className={cx('rounded-lg border px-3 py-2', toneClass)}>
      <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-current/65">{label}</div>
      <div className="mt-1 text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function WorkflowStepper({ steps, activeStep, progress }) {
  return (
    <GlassCard className="overflow-hidden">
      <CardContent className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          {steps.map((step, index) => {
            const done = index + 1 < activeStep;
            const active = index + 1 === activeStep;
            return (
              <div
                key={step.label}
                className={cx(
                  'flex min-h-9 items-center gap-2 rounded-md border px-2.5 text-xs font-semibold',
                  done && 'border-emerald-200 bg-emerald-50 text-emerald-700',
                  active && 'border-[#283A55]/25 bg-[#283A55]/8 text-[#283A55]',
                  !done && !active && 'border-border bg-muted/45 text-muted-foreground',
                )}
              >
                <span className="grid size-5 place-items-center rounded-full bg-background text-[11px]">
                  {done ? <CheckCircle2 className="size-3" /> : index + 1}
                </span>
                {step.label}
              </div>
            );
          })}
        </div>
        <Progress value={progress} className="mt-3 h-1.5 bg-muted [&>div]:bg-[#283A55]" />
      </CardContent>
    </GlassCard>
  );
}

function SectionHeading({ icon, title, description, meta }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-md border border-border bg-muted/60 text-[#283A55]">
          {icon}
        </div>
        <div className="min-w-0">
          <CardTitle className="text-foreground">{title}</CardTitle>
          {description && <CardDescription className="mt-1 text-muted-foreground">{description}</CardDescription>}
        </div>
      </div>
      {meta}
    </div>
  );
}

function LoadingRows({ columns = 5, rows = 5 }) {
  return (
    <div className="space-y-2 p-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-12 gap-2">
          {Array.from({ length: columns }).map((__, columnIndex) => (
            <Skeleton
              key={columnIndex}
              className={cx('h-8 bg-muted', columnIndex === 0 ? 'col-span-4' : 'col-span-2')}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function formatMarketLabel(market) {
  const source = market.name || market.key;

  return source
    .replace(/\bH2h\b/g, 'H2H')
    .replace(/\bH1\b/g, '1st Half')
    .replace(/\bH2\b/g, '2nd Half');
}

function getMarketFamily(marketKey) {
  if (marketKey.startsWith('player_')) return 'Player markets';
  if (marketKey.includes('corners') || marketKey.includes('cards')) return 'Corners & cards';
  if (marketKey.includes('spreads')) return 'Handicaps';
  if (marketKey.includes('totals')) return 'Totals';
  if (marketKey.includes('_h1') || marketKey.includes('_h2') || marketKey.includes('halftime')) return 'Half markets';
  if (['h2h', 'h2h_3_way', 'double_chance', 'draw_no_bet', 'btts', 'odd_even'].includes(marketKey)) return 'Main markets';
  return 'Special markets';
}

function MarketCatalogue({ event, markets, selectedKeys, onToggle, onSelectAll, onClear, onApply, applying }) {
  const groupedMarkets = markets.reduce((groups, market) => {
    const family = getMarketFamily(market.key);
    groups[family] = [...(groups[family] || []), market];
    return groups;
  }, {});

  return (
    <div className="rounded-lg border border-[#283A55]/15 bg-[#283A55]/[0.025] p-3">
      <div className="flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <div className="grid size-8 shrink-0 place-items-center rounded-md border border-[#283A55]/15 bg-white text-[#283A55]">
            <Layers3 className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-foreground">Available markets</div>
            <div className="text-xs text-muted-foreground">{markets.length} discovered for {event.homeTeam} vs {event.awayTeam}</div>
          </div>
          <Badge className="ml-auto shrink-0 border-[#283A55]/15 bg-white text-[#283A55] hover:bg-white">
            {selectedKeys.length} selected
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onSelectAll} className="h-8 border-[#283A55]/45 px-2.5 text-xs text-[#283A55] hover:bg-[#283A55]/5">
            <ListChecks className="mr-1.5 size-3.5" />
            Select all
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onClear} disabled={selectedKeys.length === 0} className="h-8 px-2.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="mr-1.5 size-3.5" />
            Clear
          </Button>
          <Button type="button" size="sm" onClick={onApply} disabled={selectedKeys.length === 0 || applying} className="h-8 bg-[#283A55] px-3 text-xs font-semibold text-white hover:bg-[#344b6b] active:scale-[0.97]">
            {applying ? <Loader2 className="mr-1.5 size-3.5 animate-spin" /> : <Check className="mr-1.5 size-3.5" />}
            Add selected to polling
          </Button>
        </div>
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-2">
        {Object.entries(groupedMarkets).map(([family, familyMarkets]) => (
          <section key={family} className="overflow-hidden rounded-md border border-border bg-background">
            <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/40 px-3 py-2">
              <span className="text-xs font-semibold text-foreground">{family}</span>
              <Badge className="bg-muted text-muted-foreground hover:bg-muted">{familyMarkets.length}</Badge>
            </div>
            <div className="grid gap-px bg-border sm:grid-cols-2">
              {familyMarkets.map((market) => {
                const checked = selectedKeys.includes(market.key);
                return (
                  <label key={market.key} className="flex min-w-0 cursor-pointer items-center gap-2 bg-background px-3 py-2.5 text-sm transition-colors hover:bg-[#283A55]/[0.035]">
                    <Checkbox checked={checked} onCheckedChange={(value) => onToggle(market.key, value === true)} aria-label={`Select ${formatMarketLabel(market)}`} />
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-foreground">{formatMarketLabel(market)}</span>
                      <span className="block truncate font-mono text-[10px] text-muted-foreground">{market.key}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </section>
        ))}
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">Adding markets updates this league&apos;s polling configuration. Each extra market increases the Odds API request cost, so select deliberately.</p>
    </div>
  );
}

export const RestorePanel = () => {
  const reduceMotion = useReducedMotion();
  const [availableSports, setAvailableSports] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dbLeagues, setDbLeagues] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState('');
  const [selectedLeagueKeys, setSelectedLeagueKeys] = useState([]);
  const [selectedEventIds, setSelectedEventIds] = useState([]);
  const [regions, setRegions] = useState(DEFAULT_REGIONS);
  const [markets, setMarkets] = useState(DEFAULT_MARKETS);
  const [pollIntervalMs, setPollIntervalMs] = useState(DEFAULT_INTERVAL);
  const [enabled, setEnabled] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [leagueSearch, setLeagueSearch] = useState('');
  const [leagueConfigFilter, setLeagueConfigFilter] = useState('all');
  const [loadingSports, setLoadingSports] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [addingSports, setAddingSports] = useState(false);
  const [addingLeagues, setAddingLeagues] = useState(false);
  const [restoringEvents, setRestoringEvents] = useState(false);
  const [syncingLeagueKeys, setSyncingLeagueKeys] = useState([]);
  const [discoveringMarketEventIds, setDiscoveringMarketEventIds] = useState([]);
  const [discoveredMarketsByEventId, setDiscoveredMarketsByEventId] = useState({});
  const [selectedDiscoveredMarketKeysByEventId, setSelectedDiscoveredMarketKeysByEventId] = useState({});
  const [configuringMarketEventIds, setConfiguringMarketEventIds] = useState([]);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.key === selectedCategoryKey) || null,
    [categories, selectedCategoryKey],
  );

  const leagueOptions = useMemo(() => {
    if (!selectedCategory) return [];

    return availableSports
      .filter((sport) => (sport.group || 'Other') === selectedCategory.name)
      .filter((sport) => markets !== 'outrights' || sport.hasOutrights)
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [availableSports, markets, selectedCategory]);

  const configuredLeagues = useMemo(
    () => dbLeagues.filter((league) => league.config),
    [dbLeagues],
  );

  const selectedLeagues = useMemo(
    () => leagueOptions.filter((league) => selectedLeagueKeys.includes(league.key)),
    [leagueOptions, selectedLeagueKeys],
  );

  const filteredLeagueOptions = useMemo(() => {
    const query = leagueSearch.trim().toLowerCase();
    return leagueOptions.filter((league) => {
      const dbLeague = dbLeagues.find((item) => item.key === league.key);
      const matchesSearch =
        !query ||
        league.title.toLowerCase().includes(query) ||
        league.key.toLowerCase().includes(query);

      const matchesConfig =
        leagueConfigFilter === 'all' ||
        (leagueConfigFilter === 'configured' && dbLeague?.config) ||
        (leagueConfigFilter === 'unconfigured' && !dbLeague?.config);

      return matchesSearch && matchesConfig;
    });
  }, [dbLeagues, leagueConfigFilter, leagueOptions, leagueSearch]);

  const eventsByLeague = useMemo(
    () =>
      selectedLeagues.map((league) => ({
        league,
        events: events.filter((event) => event.sportKey === league.key),
      })),
    [events, selectedLeagues],
  );

  const allVisibleLeaguesSelected =
    filteredLeagueOptions.length > 0 && filteredLeagueOptions.every((league) => selectedLeagueKeys.includes(league.key));

  const activeStep = selectedEventIds.length > 0 ? 5 : events.length > 0 ? 4 : selectedLeagueKeys.length > 0 ? 3 : selectedCategoryKey ? 2 : 1;
  const progress = [0, 18, 40, 64, 82, 100][activeStep];

  async function loadDbData() {
    const [categoryResponse, leagueResponse] = await Promise.all([
      api.getAdminSportCategories(),
      api.getAdminSports(),
    ]);

    setCategories(Array.isArray(categoryResponse.categories) ? categoryResponse.categories : []);
    setDbLeagues(Array.isArray(leagueResponse.sports) ? leagueResponse.sports : []);
  }

  async function loadAvailableSports() {
    setLoadingSports(true);
    try {
      const response = await api.getAvailableOddsSports();
      setAvailableSports(Array.isArray(response.sports) ? response.sports : []);
      await loadDbData();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to fetch available sports');
    } finally {
      setLoadingSports(false);
    }
  }

  async function loadEventsForLeagues(leagues = selectedLeagues) {
    if (leagues.length === 0) {
      setEvents([]);
      return;
    }

    setLoadingEvents(true);
    try {
      const responses = await Promise.all(
        leagues.map((league) =>
          api.getAdminEvents({
            sportKey: league.key,
            ...(statusFilter ? { status: statusFilter } : {}),
            limit: 300,
          }),
        ),
      );
      setEvents(responses.flatMap((response) => (Array.isArray(response.events) ? response.events : [])));
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to load events');
    } finally {
      setLoadingEvents(false);
    }
  }

  async function loadEvents() {
    return loadEventsForLeagues();
  }

  useEffect(() => {
    loadAvailableSports();
  }, []);

  useEffect(() => {
    setSelectedLeagueKeys([]);
    setSelectedEventIds([]);
  }, [selectedCategoryKey]);

  useEffect(() => {
    const visibleLeagueKeys = new Set(leagueOptions.map((league) => league.key));
    setSelectedLeagueKeys((current) => current.filter((key) => visibleLeagueKeys.has(key)));
  }, [leagueOptions]);

  useEffect(() => {
    loadEvents();
  }, [selectedLeagueKeys, dbLeagues, statusFilter]);

  useEffect(() => {
    const visibleEventIds = new Set(events.map((event) => event.id));
    setSelectedEventIds((current) => current.filter((id) => visibleEventIds.has(id)));
  }, [events]);

  async function handleAddSports() {
    setAddingSports(true);
    try {
      const result = await api.addAdminSport();
      await loadDbData();
      toast.success(`${result.categoryCount || 0} sport categories added to DB.`);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to add sports');
    } finally {
      setAddingSports(false);
    }
  }

  async function syncLeaguesAndEvents(leagues) {
    if (leagues.length === 0) return;

    const leagueKeys = leagues.map((league) => league.key);
    setSyncingLeagueKeys((current) => [...new Set([...current, ...leagueKeys])]);

    try {
      await saveLeagues(leagues);
      const results = await Promise.all(leagues.map((league) => api.syncAdminEvents(league.key)));
      const eventCount = results.reduce((total, result) => total + (result.eventCount || 0), 0);
      toast.success(`Added/configured ${leagues.length} leagues and fetched ${eventCount} events.`);
      await loadEventsForLeagues(
        leagueOptions.filter((league) => selectedLeagueKeys.includes(league.key) || leagueKeys.includes(league.key)),
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to sync league events');
    } finally {
      setSyncingLeagueKeys((current) => current.filter((key) => !leagueKeys.includes(key)));
    }
  }

  function toggleLeague(leagueKey) {
    const league = leagueOptions.find((item) => item.key === leagueKey);
    const alreadySelected = selectedLeagueKeys.includes(leagueKey);

    setSelectedLeagueKeys((current) =>
      alreadySelected
        ? current.filter((key) => key !== leagueKey)
        : [...current, leagueKey],
    );

    if (!alreadySelected && league) {
      void syncLeaguesAndEvents([league]);
    }
  }

  function toggleAllVisibleLeagues() {
    if (allVisibleLeaguesSelected) {
      setSelectedLeagueKeys((current) =>
        current.filter((key) => !filteredLeagueOptions.some((league) => league.key === key)),
      );
      return;
    }

    setSelectedLeagueKeys((current) => [...new Set([...current, ...filteredLeagueOptions.map((league) => league.key)])]);
    void syncLeaguesAndEvents(filteredLeagueOptions);
  }

  async function saveLeagues(leagues) {
    const result = await api.addAdminLeagues({
      leagues: leagues.map(normalizeSport),
      regions: [regions],
      markets: [markets],
      enabled,
      pollIntervalMs: pollIntervalMs ? Number(pollIntervalMs) : null,
    });
    await loadDbData();

    return result;
  }

  async function saveSelectedLeagues() {
    if (selectedLeagues.length === 0) return;

    return saveLeagues(selectedLeagues);
  }

  async function handleAddLeagues() {
    setAddingLeagues(true);
    try {
      const result = await saveSelectedLeagues();
      toast.success(`${result?.leagueCount || 0} leagues added/configured successfully.`);
      await loadEvents();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to add leagues');
    } finally {
      setAddingLeagues(false);
    }
  }

  async function handleStatusChange(eventId, status) {
    try {
      await api.updateAdminEventStatus(eventId, status);
      toast.success('Event status updated.');
      await loadEvents();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to update event status');
    }
  }

  async function handleReleaseStatus(eventId) {
    try {
      await api.releaseAdminEventStatus(eventId);
      toast.success('Event status released back to system control.');
      await loadEvents();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to release event status');
    }
  }

  function toggleEvent(eventId) {
    setSelectedEventIds((current) =>
      current.includes(eventId)
        ? current.filter((id) => id !== eventId)
        : [...current, eventId],
    );
  }

  async function discoverEventMarkets(event) {
    setDiscoveringMarketEventIds((current) => [...new Set([...current, event.id])]);

    try {
      const result = await api.discoverAdminEventMarkets(event.id);
      const discoveredMarkets = Array.isArray(result.markets) ? result.markets : [];
      setDiscoveredMarketsByEventId((current) => ({
        ...current,
        [event.id]: discoveredMarkets,
      }));
      toast.success(`Discovered ${discoveredMarkets.length} markets for this event.`);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to discover markets');
    } finally {
      setDiscoveringMarketEventIds((current) => current.filter((id) => id !== event.id));
    }
  }

  function toggleDiscoveredMarket(eventId, marketKey, checked) {
    setSelectedDiscoveredMarketKeysByEventId((current) => {
      const currentKeys = current[eventId] || [];
      const nextKeys = checked
        ? [...new Set([...currentKeys, marketKey])]
        : currentKeys.filter((key) => key !== marketKey);

      return { ...current, [eventId]: nextKeys };
    });
  }

  function selectAllDiscoveredMarkets(eventId) {
    const keys = (discoveredMarketsByEventId[eventId] || []).map((market) => market.key);
    setSelectedDiscoveredMarketKeysByEventId((current) => ({ ...current, [eventId]: keys }));
  }

  function clearDiscoveredMarkets(eventId) {
    setSelectedDiscoveredMarketKeysByEventId((current) => ({ ...current, [eventId]: [] }));
  }

  async function applyDiscoveredMarketsToLeague(event) {
    const selectedMarketKeys = selectedDiscoveredMarketKeysByEventId[event.id] || [];
    if (selectedMarketKeys.length === 0) return;

    setConfiguringMarketEventIds((current) => [...new Set([...current, event.id])]);
    try {
      const league = dbLeagues.find((item) => item.key === event.sportKey);
      const existingConfig = league?.config;
      const mergedMarkets = [...new Set([...(existingConfig?.markets || []), ...selectedMarketKeys])];

      await api.updateAdminLeagueSettings(event.sportKey, {
        active: league?.active ?? true,
        regions: existingConfig?.regions?.length ? existingConfig.regions : [regions],
        markets: mergedMarkets,
        enabled: existingConfig?.enabled ?? enabled,
        pollIntervalMs: existingConfig?.pollIntervalMs ?? (pollIntervalMs ? Number(pollIntervalMs) : null),
      });

      await loadDbData();
      toast.success(`${selectedMarketKeys.length} markets added to ${league?.title || event.sportKey} polling.`);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to add selected markets to polling');
    } finally {
      setConfiguringMarketEventIds((current) => current.filter((id) => id !== event.id));
    }
  }

  async function restoreEventsByIds(eventIds) {
    if (eventIds.length === 0) return;

    setRestoringEvents(true);

    try {
      const result = await api.restoreAdminEvents({
        eventIds,
        marketKey: markets,
      });
      toast.success(
        `Restored ${result.eventCount || 0} events with ${result.marketCount || 0} markets and ${result.outcomeCount || 0} outcomes. New this click: ${result.createdMarketCount || 0} markets, ${result.createdOutcomeCount || 0} outcomes.`,
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to add events');
    } finally {
      setRestoringEvents(false);
    }
  }

  function restoreSelectedEvents() {
    void restoreEventsByIds(selectedEventIds);
  }

  function restoreAllVisibleEvents() {
    void restoreEventsByIds(events.map((event) => event.id));
  }

  return (
    <TooltipProvider delay={250}>
      <div className="min-h-screen bg-transparent p-0 text-foreground ">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 ">
          <header className="sticky top-16 z-10 rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row  xl:items-start xl:justify-between ">
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge className="border-[#283A55]/20 bg-muted/8 text-[#283A55] hover:bg-muted/10">Control room workflow</Badge>
                  <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">API connected</Badge>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">Restore Sports & Events</h1>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                  Add sport categories, configure region and market rules, select leagues, inspect event inventory, and sync sportsbook data into the admin system.
                </p>
              </div>

              {/* <div className="grid grid-cols-3 gap-2 sm:min-w-[440px]">
                <StatBadge label="Available leagues" value={availableSports.length} />
                <StatBadge label="Configured sports" value={categories.length} tone="warning" />
                <StatBadge label="Synced events" value={events.length} tone="success" />
              </div> */}
            </div>

            <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <WorkflowStepper
                activeStep={activeStep}
                progress={progress}
                steps={[
                  { label: 'Sport' },
                  { label: 'Region & market' },
                  { label: 'Leagues' },
                  { label: 'Events' },
                  { label: 'Sync' },
                ]}
              />
              <div className="flex shrink-0 flex-wrap gap-2">
                <Button onClick={loadAvailableSports} disabled={loadingSports} className={primaryActionButton}>
                  {loadingSports ? <Loader2 className="mr-2 size-4 animate-spin" /> : <RefreshCw className="mr-2 size-4" />}
                  {loadingSports ? 'Fetching sports' : 'Fetch Sports From API'}
                </Button>
                <Button
                  onClick={handleAddSports}
                  disabled={addingSports || availableSports.length === 0}
                  className={primaryActionButton}
                >
                  {addingSports ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Database className="mr-2 size-4" />}
                  {addingSports ? 'Adding Sports' : 'Add Sports'}
                </Button>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <motion.div {...panelMotion(reduceMotion)} className="xl:col-span-7">
              <GlassCard className="h-full ">
                <CardHeader>
                  <SectionHeading
                  
                    icon={<Trophy className="size-4" />}
                    title="Step 1. Select sport"
                    description="Choose the sport category that owns the league inventory."
                    meta={<Badge className="border-border bg-muted/55 text-foreground hover:bg-muted/55">{categories.length} in DB</Badge>}
                  />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select
                  className='outline-2'
                    value={selectedCategoryKey || undefined}
                    onValueChange={setSelectedCategoryKey}
                    disabled={loadingSports || categories.length === 0}
                  >
                    <SelectTrigger aria-label="Select sport category" className={selectControl}>
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.key} value={category.key}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="grid gap-2 sm:grid-cols-3">
                    <div className="rounded-lg border border-border bg-muted/35 p-3">
                      <div className="text-xs text-muted-foreground">Selected</div>
                      <div className="mt-1 truncate text-sm font-semibold text-foreground">{selectedCategory?.name || 'No sport selected'}</div>
                    </div>
                    <div className="rounded-lg border border-border bg-muted/35 p-3">
                      <div className="text-xs text-muted-foreground">Visible leagues</div>
                      <div className="mt-1 text-sm font-semibold text-foreground">{leagueOptions.length}</div>
                    </div>
                    <div className="rounded-lg border border-border bg-muted/35 p-3">
                      <div className="text-xs text-muted-foreground">Selected leagues</div>
                      <div className="mt-1 text-sm font-semibold text-foreground">{selectedLeagueKeys.length}</div>
                    </div>
                  </div>
                </CardContent>
              </GlassCard>
            </motion.div>

            <motion.div {...panelMotion(reduceMotion)} className="xl:col-span-5">
              <GlassCard className="xl:sticky xl:top-52">
                <CardHeader>
                  <SectionHeading
                    icon={<ServerCog className="size-4" />}
                    title="Step 2. Region & market"
                    description="These settings apply when selected leagues are configured."
                    meta={<Badge className={enabled ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50' : 'bg-amber-50 text-amber-700 hover:bg-amber-50'}>{enabled ? 'Enabled' : 'Disabled'}</Badge>}
                  />
                </CardHeader>
                <CardContent className="space-y-3">
                  <label className="grid gap-1.5 text-sm">
                    <span className="font-medium text-foreground">Region</span>
                    <Select value={regions} onValueChange={setRegions}>
                      <SelectTrigger aria-label="Select region" className={selectControl}>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        {REGION_OPTIONS.map((region) => (
                          <SelectItem key={region.value} value={region.value}>
                            {region.label} ({region.value})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </label>

                  <label className="grid gap-1.5 text-sm">
                    <span className="font-medium text-foreground">Market</span>
                    <Select value={markets} onValueChange={setMarkets}>
                      <SelectTrigger aria-label="Select market" className={selectControl}>
                        <SelectValue placeholder="Select market" />
                      </SelectTrigger>
                      <SelectContent>
                        {MARKET_OPTIONS.map((market) => (
                          <SelectItem key={market.value} value={market.value}>
                            {market.label} ({market.value})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </label>

                  <label className="grid gap-1.5 text-sm">
                    <span className="font-medium text-foreground">Poll interval MS</span>
                    <Input
                      type="number"
                      min="1000"
                      value={pollIntervalMs}
                      onChange={(event) => setPollIntervalMs(event.target.value)}
                      className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-[#283A55]"
                    />
                  </label>

                  <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border-2 border-[#283A55]/35 bg-white p-3 text-sm font-medium text-foreground shadow-[inset_0_0_0_1px_rgba(40,58,85,0.05),0_1px_2px_rgba(15,23,42,0.05)] transition-colors hover:border-[#283A55]/60 hover:bg-[#283A55]/5">
                    <Checkbox checked={enabled} onCheckedChange={setEnabled} aria-label="Enable selected leagues for event sync and odds polling" />
                    Enable selected leagues for event sync and odds polling
                  </label>
                </CardContent>
              </GlassCard>
            </motion.div>
          </div>

          <motion.section {...panelMotion(reduceMotion)}>
            <GlassCard>
              <CardHeader>
                <SectionHeading
                  icon={<Filter className="size-4" />}
                  title="Step 3. Select leagues"
                  description="Search, filter, and bulk-select leagues before event sync."
                  meta={<Badge className="border-border bg-muted/55 text-foreground hover:bg-muted/55">{selectedLeagues.length} selected</Badge>}
                />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-2 lg:grid-cols-[1fr_180px_auto_auto]">
                  <label className="relative">
                    <Search className="pointer-events-none absolute left-3  top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={leagueSearch}
                      onChange={(event) => setLeagueSearch(event.target.value)}
                      placeholder="Search league name or key"
                      aria-label="Search leagues"
                      className="border-border  bg-background pl-9  text-foreground placeholder:text-muted-foreground"
                    />
                  </label>
                  <Select value={leagueConfigFilter} onValueChange={setLeagueConfigFilter}>
                    <SelectTrigger aria-label="Filter configured leagues" className={selectControl}>
                      <SelectValue placeholder="All leagues" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All leagues</SelectItem>
                      <SelectItem value="configured">Configured</SelectItem>
                      <SelectItem value="unconfigured">Unconfigured</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={toggleAllVisibleLeagues} disabled={filteredLeagueOptions.length === 0} className={secondaryActionButton}>
                    {allVisibleLeaguesSelected ? 'Clear Visible' : 'Select Visible'}
                  </Button>
                  <Button onClick={handleAddLeagues} disabled={selectedLeagues.length === 0 || addingLeagues} className={primaryActionButton}>
                    {addingLeagues ? <Loader2 className="mr-2 size-4 animate-spin" /> : <ShieldCheck className="mr-2 size-4" />}
                    {addingLeagues ? 'Configuring' : 'Add Selected'}
                  </Button>
                </div>

                <Separator className="bg-muted" />

                {!selectedCategory ? (
                  <EmptyState
                    icon={<Trophy className="size-5" />}
                    title="Select a sport category"
                    description="The league table will populate after you choose a sport from Step 1."
                    className="border-border bg-muted/35 text-muted-foreground"
                  />
                ) : filteredLeagueOptions.length === 0 ? (
                  <EmptyState
                    icon={<Search className="size-5" />}
                    title="No leagues match this view"
                    description="Adjust the search term, market type, or configuration filter."
                    className="border-border bg-muted/35 text-muted-foreground"
                  />
                ) : (
                  <div className={cx(nativeScrollArea, 'h-[420px]')}>
                    <Table>
                      <TableHeader className="sticky top-0 z-[1] bg-muted">
                        <TableRow className="border-border hover:bg-transparent">
                          <TableHead className="w-10 text-muted-foreground">Pick</TableHead>
                          <TableHead className="text-muted-foreground">League</TableHead>
                          <TableHead className="text-muted-foreground">Key</TableHead>
                          <TableHead className="text-muted-foreground">Outrights</TableHead>
                          <TableHead className="text-right text-muted-foreground">State</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLeagueOptions.map((league) => {
                          const dbLeague = dbLeagues.find((item) => item.key === league.key);
                          const isSelected = selectedLeagueKeys.includes(league.key);
                          const isSyncing = syncingLeagueKeys.includes(league.key);

                          return (
                            <TableRow key={league.key} className="border-border text-foreground hover:bg-muted/55">
                              <TableCell>
                                <Checkbox checked={isSelected} onCheckedChange={() => toggleLeague(league.key)} aria-label={`Select ${league.title}`} />
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">{league.title}</div>
                                {league.description && <div className="max-w-md truncate text-xs text-muted-foreground">{league.description}</div>}
                              </TableCell>
                              <TableCell className="font-mono text-xs text-muted-foreground">{league.key}</TableCell>
                              <TableCell>
                                <Badge className={league.hasOutrights ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50' : 'bg-muted/55 text-muted-foreground hover:bg-muted/55'}>
                                  {league.hasOutrights ? 'Yes' : 'No'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge className={cx(
                                  isSyncing && 'bg-[#283A55]/8 text-[#283A55] hover:bg-[#283A55]/10',
                                  !isSyncing && dbLeague?.config && 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50',
                                  !isSyncing && dbLeague && !dbLeague.config && 'bg-amber-50 text-amber-700 hover:bg-amber-50',
                                  !isSyncing && !dbLeague && 'bg-muted/55 text-muted-foreground hover:bg-muted/55',
                                )}>
                                  {isSyncing ? 'Syncing' : dbLeague?.config ? 'Configured' : dbLeague ? 'Added' : 'Not added'}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </GlassCard>
          </motion.section>

          <motion.section {...panelMotion(reduceMotion)}>
            <GlassCard>
              <CardHeader>
                <SectionHeading
                  icon={<Database className="size-4" />}
                  title="Step 4. Select events and sync data"
                  description="Review event inventory, adjust admin status controls, then restore selected or visible events."
                  meta={<Badge className="border-border bg-muted/55 text-foreground hover:bg-muted/55">{selectedEventIds.length} selected</Badge>}
                />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                  <div className="grid gap-2 sm:grid-cols-[180px_auto]">
                    <Select value={statusFilter || 'all'} onValueChange={(value) => setStatusFilter(value === 'all' ? '' : value)}>
                      <SelectTrigger aria-label="Filter events by status" className={selectControl}>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        {STATUS_OPTIONS.filter(Boolean).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={loadEvents} disabled={selectedLeagues.length === 0 || loadingEvents} className={secondaryActionButton}>
                      <RefreshCw className="mr-2 size-4" />
                      Refresh events
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={restoreSelectedEvents} disabled={selectedEventIds.length === 0 || restoringEvents} className={secondaryActionButton}>
                      Add Selected Events
                    </Button>
                    <Button onClick={restoreAllVisibleEvents} disabled={events.length === 0 || restoringEvents} className={primaryActionButton}>
                      {restoringEvents ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                      Add All Visible Events
                    </Button>
                  </div>
                </div>

                <Separator className="bg-muted" />

                {loadingEvents ? (
                  <LoadingRows columns={5} rows={7} />
                ) : selectedLeagueKeys.length === 0 ? (
                  <EmptyState
                    icon={<Database className="size-5" />}
                    title="No leagues selected"
                    description="Select leagues in Step 3 to load event inventory for this market configuration."
                    className="border-border bg-muted/35 text-muted-foreground"
                  />
                ) : events.length === 0 ? (
                  <EmptyState
                    icon={<RefreshCw className="size-5" />}
                    title="No events loaded"
                    description="Use Refresh events or select additional leagues. Events are loaded from configured league selections."
                    action={<Button onClick={loadEvents} className={primaryActionButton}>Load events</Button>}
                    className="border-border bg-muted/35 text-muted-foreground"
                  />
                ) : (
                  <div className="space-y-4">
                    {eventsByLeague.map(({ league, events: leagueEvents }) => (
                      <div key={league.key} className="overflow-hidden rounded-lg border border-border bg-background/80">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/35 px-3 py-2">
                          <div>
                            <div className="text-sm font-semibold text-foreground">{league.title}</div>
                            <div className="font-mono text-xs text-muted-foreground">{league.key}</div>
                          </div>
                          <Badge className="bg-[#283A55]/8 text-[#283A55] hover:bg-[#283A55]/10">{leagueEvents.length} events</Badge>
                        </div>

                        {leagueEvents.length === 0 ? (
                          <EmptyState
                            title="No events for this league"
                            description="The API returned no events for this league and status filter."
                            className="m-3 min-h-28 border-border bg-muted/35 text-muted-foreground"
                          />
                        ) : (
                          <div className={cx(nativeScrollArea, 'max-h-[460px]')}>
                            <Table>
                              <TableHeader className="sticky top-0 z-[1] bg-muted">
                                <TableRow className="border-border hover:bg-transparent">
                                  <TableHead className="w-10 text-muted-foreground">Pick</TableHead>
                                  <TableHead className="text-muted-foreground">Event</TableHead>
                                  <TableHead className="text-muted-foreground">Start</TableHead>
                                  <TableHead className="text-muted-foreground">Status</TableHead>
                                  <TableHead className="text-right text-muted-foreground">Control</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {leagueEvents.map((event) => (
                                  <React.Fragment key={event.id}>
                                  <TableRow className="border-border text-foreground hover:bg-muted/55">
                                    <TableCell>
                                      <Checkbox checked={selectedEventIds.includes(event.id)} onCheckedChange={() => toggleEvent(event.id)} aria-label={`Select ${event.homeTeam} versus ${event.awayTeam}`} />
                                    </TableCell>
                                    <TableCell>
                                      <div className="font-medium">{event.homeTeam} vs {event.awayTeam}</div>
                                      <div className="font-mono text-xs text-muted-foreground">{event.id}</div>
                                      <div className="mt-2 flex flex-wrap items-center gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => discoverEventMarkets(event)}
                                          disabled={discoveringMarketEventIds.includes(event.id)}
                                          className={cx(secondaryActionButton, 'h-8 px-2.5 text-xs')}
                                        >
                                          {discoveringMarketEventIds.includes(event.id) ? <Loader2 className="mr-1.5 size-3.5 animate-spin" /> : <Search className="mr-1.5 size-3.5" />}
                                          {discoveredMarketsByEventId[event.id] ? 'Refresh market catalogue' : 'Discover markets'}
                                        </Button>
                                        {discoveredMarketsByEventId[event.id] && (
                                          <Badge className="border-[#283A55]/15 bg-[#283A55]/8 text-[#283A55] hover:bg-[#283A55]/8">
                                            {discoveredMarketsByEventId[event.id].length} available
                                          </Badge>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{formatDate(event.commenceTime)}</TableCell>
                                    <TableCell>
                                      <Select value={event.status} onValueChange={(value) => handleStatusChange(event.id, value)}>
                                        <SelectTrigger aria-label={`Change status for ${event.homeTeam} versus ${event.awayTeam}`} className={cx(selectControl, 'w-36')}>
                                          <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="PRE_MATCH">PRE_MATCH</SelectItem>
                                          <SelectItem value="LIVE">LIVE</SelectItem>
                                          <SelectItem value="SETTLED">SETTLED</SelectItem>
                                          <SelectItem value="POSTPONED">POSTPONED</SelectItem>
                                          <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex items-center justify-end gap-2">
                                        <Badge className={event.statusSource === 'ADMIN' ? 'bg-amber-50 text-amber-700 hover:bg-amber-50' : 'bg-muted/55 text-muted-foreground hover:bg-muted/55'}>
                                          {event.statusSource}
                                        </Badge>
                                        <Tooltip>
                                          <TooltipTrigger
                                            render={
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={event.statusSource !== 'ADMIN'}
                                                onClick={() => handleReleaseStatus(event.id)}
                                                className={cx(secondaryActionButton, 'h-8 px-3 text-xs')}
                                              />
                                            }
                                          >
                                            Release
                                          </TooltipTrigger>
                                          <TooltipContent>Release admin override back to system control</TooltipContent>
                                        </Tooltip>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                  {(discoveredMarketsByEventId[event.id] || []).length > 0 && (
                                    <TableRow className="border-border bg-muted/[0.18] hover:bg-muted/[0.18]">
                                      <TableCell colSpan={5} className="p-3">
                                        <MarketCatalogue
                                          event={event}
                                          markets={discoveredMarketsByEventId[event.id]}
                                          selectedKeys={selectedDiscoveredMarketKeysByEventId[event.id] || []}
                                          onToggle={(marketKey, checked) => toggleDiscoveredMarket(event.id, marketKey, checked)}
                                          onSelectAll={() => selectAllDiscoveredMarkets(event.id)}
                                          onClear={() => clearDiscoveredMarkets(event.id)}
                                          onApply={() => applyDiscoveredMarketsToLeague(event)}
                                          applying={configuringMarketEventIds.includes(event.id)}
                                        />
                                      </TableCell>
                                    </TableRow>
                                  )}
                                  </React.Fragment>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </GlassCard>
          </motion.section>
        </div>
      </div>
    </TooltipProvider>
  );
};

