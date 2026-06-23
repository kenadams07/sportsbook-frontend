import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Activity,
  CalendarClock,
  Database,
  Loader2,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
} from 'lucide-react';

import { api } from '../services/api';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/shadcn-ui/accordion';
import { Badge } from '../components/shadcn-ui/badge';
import { Button } from '../components/shadcn-ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/shadcn-ui/card';
import { Checkbox } from '../components/shadcn-ui/checkbox';
import { EmptyState } from '../components/shadcn-ui/empty-state';
import { Input } from '../components/shadcn-ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/shadcn-ui/select';
import { Separator } from '../components/shadcn-ui/separator';
import { Skeleton } from '../components/shadcn-ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/shadcn-ui/tabs';
import './Events.css';

const STATUS_TONE = {
  LIVE: 'event-badge live',
  PRE_MATCH: 'event-badge pre',
  SETTLED: 'event-badge settled',
  POSTPONED: 'event-badge muted',
  CANCELLED: 'event-badge muted',
};

const REGION_OPTIONS = ['us', 'us2', 'uk', 'eu', 'au'];
const MARKET_OPTIONS = ['h2h', 'spreads', 'totals', 'outrights'];
const EVENT_STATUSES = ['PRE_MATCH', 'LIVE', 'SETTLED', 'POSTPONED', 'CANCELLED'];
const MARKET_STATUSES = [
  { value: 'OPEN', label: 'Open' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'ONE', label: 'Open' },
  { value: 'TWO', label: 'Suspended' },
  { value: 'THREE', label: 'Closed' },
];
const OUTCOME_STATUSES = ['ACTIVE', 'INACTIVE'];

function getMarketStatusLabel(status) {
  return MARKET_STATUSES.find((item) => item.value === status)?.label || 'Open';
}

function formatDateTime(value) {
  if (!value) return 'No start time';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Invalid date';

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function groupEventsByLeague(events) {
  return events.reduce((acc, event) => {
    acc[event.sportKey] = acc[event.sportKey] || [];
    acc[event.sportKey].push(event);
    return acc;
  }, {});
}

function EventSkeleton() {
  return (
    <div className="events-skeleton">
      {Array.from({ length: 5 }).map((_, index) => (
        <div className="events-skeleton-row" key={index}>
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="events-skeleton-lines">
            <Skeleton className="h-4 w-64 max-w-full" />
            <Skeleton className="h-3 w-40 max-w-full" />
          </div>
          <Skeleton className="ml-auto h-7 w-24" />
        </div>
      ))}
    </div>
  );
}

function MarketInventory({ markets = [], onMarketStatusChange, onOutcomeStatusChange, updatingKey }) {
  if (!markets.length) {
    return (
      <div className="market-empty">
        <Database className="size-4" />
        No markets restored for this event yet.
      </div>
    );
  }

  return (
    <div className="market-grid">
      {markets.map((market) => (
        <div key={market.id} className="market-block">
          <div className="market-head">
            <div>
              <strong>{market.marketName}</strong>
            </div>
            <div className="market-actions">
              <Badge className="market-type-badge">{market.marketType}</Badge>
              <Select
                value={market.status}
                onValueChange={(value) => onMarketStatusChange(market.id, value)}
                disabled={updatingKey === `market:${market.id}`}
              >
                <SelectTrigger aria-label={`Change status for ${market.marketName}`} className="settings-select compact">
                  <span>{getMarketStatusLabel(market.status)}</span>
                </SelectTrigger>
                <SelectContent>
                  {MARKET_STATUSES.filter((status) => ['OPEN', 'SUSPENDED', 'CLOSED'].includes(status.value)).map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="outcome-list">
            {market.outcomes?.length ? (
              market.outcomes.map((outcome) => (
                <div key={outcome.id} className="outcome-pill">
                  <span>{outcome.name}</span>
                  {outcome.selectionId !== outcome.name && <small>{outcome.selectionId}</small>}
                  <Select
                    value={outcome.status}
                    onValueChange={(value) => onOutcomeStatusChange(outcome.id, { status: value, actualStatus: value })}
                    disabled={updatingKey === `outcome:${outcome.id}`}
                  >
                    <SelectTrigger aria-label={`Change status for ${outcome.name}`} className="settings-select outcome">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {OUTCOME_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))
            ) : (
              <div className="outcome-empty">No outcomes</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function EventRow({
  event,
  onEventStatusChange,
  onReleaseEventStatus,
  onMarketStatusChange,
  onOutcomeStatusChange,
  updatingKey,
}) {
  return (
    <div className="event-inventory-row">
      <div className="event-status-rail" data-status={event.status} />
      <div className="event-main">
        <div className="event-title-line">
          <strong>{event.homeTeam} vs {event.awayTeam}</strong>
          <div className="event-actions">
            <span className={STATUS_TONE[event.status] || 'event-badge muted'}>{event.status}</span>
            <Select
              value={event.status}
              onValueChange={(value) => onEventStatusChange(event.id, value)}
              disabled={updatingKey === `event:${event.id}`}
            >
              <SelectTrigger aria-label={`Change status for ${event.homeTeam} versus ${event.awayTeam}`} className="settings-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EVENT_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              disabled={event.statusSource !== 'ADMIN' || updatingKey === `event-release:${event.id}`}
              onClick={() => onReleaseEventStatus(event.id)}
              className="release-button"
            >
              Release
            </Button>
          </div>
        </div>
        <div className="event-meta-line">
          <span>{formatDateTime(event.commenceTime)}</span>
          <span>{event.statusSource}</span>
        </div>
        <MarketInventory
          markets={event.markets}
          onMarketStatusChange={onMarketStatusChange}
          onOutcomeStatusChange={onOutcomeStatusChange}
          updatingKey={updatingKey}
        />
      </div>
    </div>
  );
}

function LeagueSettings({ league, onSave, updating }) {
  const [active, setActive] = useState(league.active ?? true);
  const [enabled, setEnabled] = useState(league.config?.enabled ?? false);
  const [region, setRegion] = useState(league.config?.regions?.[0] || 'us');
  const [market, setMarket] = useState(league.config?.markets?.[0] || 'h2h');
  const [pollIntervalMs, setPollIntervalMs] = useState(String(league.config?.pollIntervalMs || 30000));

  useEffect(() => {
    setActive(league.active ?? true);
    setEnabled(league.config?.enabled ?? false);
    setRegion(league.config?.regions?.[0] || 'us');
    setMarket(league.config?.markets?.[0] || 'h2h');
    setPollIntervalMs(String(league.config?.pollIntervalMs || 30000));
  }, [league]);

  return (
    <div className="league-settings">
      <div className="settings-title">
        <Settings className="size-4" />
        League settings
      </div>
      <label className="settings-check">
        <Checkbox checked={active} onCheckedChange={setActive} />
        Active
      </label>
      <label className="settings-check">
        <Checkbox checked={enabled} onCheckedChange={setEnabled} />
        Polling enabled
      </label>
      <Select value={region} onValueChange={setRegion}>
        <SelectTrigger aria-label="League region" className="settings-select">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {REGION_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={market} onValueChange={setMarket}>
        <SelectTrigger aria-label="League market" className="settings-select">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MARKET_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="number"
        min="1000"
        value={pollIntervalMs}
        onChange={(event) => setPollIntervalMs(event.target.value)}
        aria-label="Poll interval milliseconds"
        className="settings-input"
      />
      <Button
        size="sm"
        onClick={() =>
          onSave(league.key, {
            active,
            enabled,
            regions: [region],
            markets: [market],
            pollIntervalMs: pollIntervalMs ? Number(pollIntervalMs) : null,
          })
        }
        disabled={updating}
      >
        {updating ? <Loader2 className="size-3 animate-spin" /> : null}
        Save
      </Button>
    </div>
  );
}

const Events = () => {
  const [categories, setCategories] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedSportKey, setSelectedSportKey] = useState('');
  const [openLeagueKeys, setOpenLeagueKeys] = useState({});
  const [query, setQuery] = useState('');
  const [loadingInventory, setLoadingInventory] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [updatingKey, setUpdatingKey] = useState('');

  const selectedSport = useMemo(
    () => categories.find((category) => category.key === selectedSportKey) || null,
    [categories, selectedSportKey],
  );

  const sportLeagues = useMemo(() => {
    const q = query.trim().toLowerCase();

    return leagues
      .filter((league) => league.categoryKey === selectedSportKey || league.categoryName === selectedSport?.name)
      .filter((league) => {
        if (!q) return true;
        return (
          league.title?.toLowerCase().includes(q) ||
          league.key?.toLowerCase().includes(q) ||
          league.group?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [leagues, query, selectedSport?.name, selectedSportKey]);

  const eventsByLeague = useMemo(() => groupEventsByLeague(events), [events]);

  const totals = useMemo(() => {
    const marketCount = events.reduce((sum, event) => sum + (event.markets?.length || 0), 0);
    const outcomeCount = events.reduce(
      (sum, event) => sum + (event.markets || []).reduce((inner, market) => inner + (market.outcomes?.length || 0), 0),
      0,
    );

    return {
      leagues: sportLeagues.length,
      events: events.length,
      markets: marketCount,
      outcomes: outcomeCount,
    };
  }, [events, sportLeagues.length]);

  async function loadInventory() {
    setLoadingInventory(true);
    try {
      const [categoryResponse, leagueResponse] = await Promise.all([
        api.getAdminSportCategories(),
        api.getAdminSports(),
      ]);
      const nextCategories = Array.isArray(categoryResponse.categories) ? categoryResponse.categories : [];
      const nextLeagues = Array.isArray(leagueResponse.sports) ? leagueResponse.sports : [];

      setCategories(nextCategories);
      setLeagues(nextLeagues);
      setSelectedSportKey((current) => current || nextCategories[0]?.key || '');
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to load sports inventory');
    } finally {
      setLoadingInventory(false);
    }
  }

  async function loadEventsForSport(leaguesForSport = sportLeagues) {
    if (!selectedSportKey || leaguesForSport.length === 0) {
      setEvents([]);
      return;
    }

    setLoadingEvents(true);
    try {
      const responses = await Promise.all(
        leaguesForSport.map((league) =>
          api.getAdminEvents({
            sportKey: league.key,
            limit: 500,
          }),
        ),
      );
      const nextEvents = responses.flatMap((response) => (Array.isArray(response.events) ? response.events : []));
      setEvents(nextEvents);

      setOpenLeagueKeys((current) => {
        if (Object.keys(current).length) return current;
        const firstLeagueWithEvents = leaguesForSport.find((league) =>
          nextEvents.some((event) => event.sportKey === league.key),
        );
        return firstLeagueWithEvents ? { [firstLeagueWithEvents.key]: true } : {};
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to load events');
    } finally {
      setLoadingEvents(false);
    }
  }

  useEffect(() => {
    void loadInventory();
  }, []);

  useEffect(() => {
    setEvents([]);
    setOpenLeagueKeys({});
  }, [selectedSportKey]);

  useEffect(() => {
    if (!loadingInventory) {
      void loadEventsForSport(sportLeagues);
    }
  }, [loadingInventory, selectedSportKey, leagues]);

  function refreshAll() {
    void loadInventory();
  }

  function toggleLeague(leagueKey) {
    setOpenLeagueKeys((current) => ({
      ...current,
      [leagueKey]: !current[leagueKey],
    }));
  }

  async function runSettingUpdate(key, updater, reloadInventory = false) {
    setUpdatingKey(key);
    try {
      await updater();
      if (reloadInventory) {
        await loadInventory();
      } else {
        await loadEventsForSport(sportLeagues);
      }
      toast.success('Setting updated successfully.');
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to update setting');
    } finally {
      setUpdatingKey('');
    }
  }

  function updateSportActive(categoryKey, active) {
    void runSettingUpdate(
      `sport:${categoryKey}`,
      () => api.updateAdminSportCategorySettings(categoryKey, { active }),
      true,
    );
  }

  function updateLeagueSettings(leagueKey, payload) {
    void runSettingUpdate(
      `league:${leagueKey}`,
      () => api.updateAdminLeagueSettings(leagueKey, payload),
      true,
    );
  }

  function updateEventStatus(eventId, status) {
    void runSettingUpdate(`event:${eventId}`, () => api.updateAdminEventStatus(eventId, status));
  }

  function releaseEventStatus(eventId) {
    void runSettingUpdate(`event-release:${eventId}`, () => api.releaseAdminEventStatus(eventId));
  }

  function updateMarketStatus(marketId, status) {
    void runSettingUpdate(`market:${marketId}`, () => api.updateAdminMarketStatus(marketId, status));
  }

  function updateOutcomeStatus(outcomeId, payload) {
    void runSettingUpdate(`outcome:${outcomeId}`, () => api.updateAdminOutcomeStatus(outcomeId, payload));
  }

  return (
    <div className="events-page">
      <header className="events-header">
        <div>
          <div className="events-eyebrow">
            <ShieldCheck className="size-4" />
            DB inventory
          </div>
          <h1>Manage Events</h1>
          <p>Browse the exact sports, leagues, events, markets, and outcomes currently restored in the odds database.</p>
        </div>
        <Button variant="outline" onClick={refreshAll} disabled={loadingInventory || loadingEvents} className="events-refresh">
          {loadingInventory || loadingEvents ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          Refresh
        </Button>
      </header>

      <section className="events-stats">
        <div>
          <span>Leagues</span>
          <strong>{totals.leagues}</strong>
        </div>
        <div>
          <span>Events</span>
          <strong>{totals.events}</strong>
        </div>
        <div>
          <span>Markets</span>
          <strong>{totals.markets}</strong>
        </div>
        <div>
          <span>Outcomes</span>
          <strong>{totals.outcomes}</strong>
        </div>
      </section>

      <Card className="events-inventory-card">
        <CardHeader className="events-card-head">
          <div>
            <CardTitle>Sports Inventory</CardTitle>
            <p>Sport tabs control the league accordion below.</p>
          </div>
          <label className="events-search">
            <Search className="size-4" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search leagues"
              aria-label="Search leagues"
            />
          </label>
        </CardHeader>
        <CardContent>
          {loadingInventory ? (
            <EventSkeleton />
          ) : categories.length === 0 ? (
            <EmptyState
              icon={<Database className="size-5" />}
              title="No sports in DB"
              description="Use Restore Panel to add sports and leagues first."
              className="events-empty"
            />
          ) : (
            <Tabs value={selectedSportKey} onValueChange={setSelectedSportKey}>
              <div className="events-tabs-scroll">
                <TabsList className="events-tabs-list">
                  {categories.map((category) => {
                    const leagueCount = leagues.filter(
                      (league) => league.categoryKey === category.key || league.categoryName === category.name,
                    ).length;

                    return (
                      <TabsTrigger key={category.key} value={category.key} className="events-tab-trigger">
                        {category.name}
                        <span>{leagueCount}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              {categories.map((category) => (
                <TabsContent key={category.key} value={category.key}>
                  <div className="events-sport-toolbar">
                    <div>
                      <h2>{category.name}</h2>
                      <p>{sportLeagues.length} leagues configured or added for this sport.</p>
                    </div>
                    <div className="sport-settings">
                      <label className="settings-check">
                        <Checkbox
                          checked={category.active}
                          onCheckedChange={(checked) => updateSportActive(category.key, Boolean(checked))}
                          disabled={updatingKey === `sport:${category.key}`}
                        />
                        Sport active
                      </label>
                      {loadingEvents && (
                        <Badge className="events-loading-badge">
                          <Loader2 className="size-3 animate-spin" />
                          Loading events
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Separator className="events-separator" />

                  {loadingEvents ? (
                    <EventSkeleton />
                  ) : sportLeagues.length === 0 ? (
                    <EmptyState
                      icon={<Activity className="size-5" />}
                      title="No leagues for this sport"
                      description="Add leagues from Restore Panel to make them visible here."
                      className="events-empty"
                    />
                  ) : (
                    <Accordion>
                      {sportLeagues.map((league) => {
                        const leagueEvents = eventsByLeague[league.key] || [];
                        const marketCount = leagueEvents.reduce((sum, event) => sum + (event.markets?.length || 0), 0);
                        const outcomeCount = leagueEvents.reduce(
                          (sum, event) =>
                            sum + (event.markets || []).reduce((inner, market) => inner + (market.outcomes?.length || 0), 0),
                          0,
                        );

                        return (
                          <AccordionItem
                            key={league.key}
                            open={Boolean(openLeagueKeys[league.key])}
                            onOpenChange={() => toggleLeague(league.key)}
                            className="league-accordion-item"
                          >
                            <AccordionTrigger className="league-trigger">
                              <div className="league-trigger-main">
                                <div className="league-icon">
                                  <CalendarClock className="size-4" />
                                </div>
                                <div>
                                  <strong>{league.title}</strong>
                                  <small>{league.key}</small>
                                </div>
                              </div>
                              <div className="league-trigger-meta">
                                <Badge className={league.config?.enabled ? 'league-badge enabled' : 'league-badge muted'}>
                                  {league.config?.enabled ? 'Enabled' : 'Not polling'}
                                </Badge>
                                <span>{leagueEvents.length} events</span>
                                <span>{marketCount} markets</span>
                                <span>{outcomeCount} outcomes</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <LeagueSettings
                                league={league}
                                onSave={updateLeagueSettings}
                                updating={updatingKey === `league:${league.key}`}
                              />
                              {leagueEvents.length === 0 ? (
                                <EmptyState
                                  title="No events synced"
                                  description="Fetch events from Restore Panel for this league."
                                  className="events-empty compact"
                                />
                              ) : (
                                <div className="event-inventory-list">
                                  {leagueEvents.map((event) => (
                                    <EventRow
                                      key={event.id}
                                      event={event}
                                      onEventStatusChange={updateEventStatus}
                                      onReleaseEventStatus={releaseEventStatus}
                                      onMarketStatusChange={updateMarketStatus}
                                      onOutcomeStatusChange={updateOutcomeStatus}
                                      updatingKey={updatingKey}
                                    />
                                  ))}
                                </div>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Events;
