export const keys = {
  snapshot: (eventId: string) => `odds:snap:${eventId}`,
  channel: (sportKey: string) => `odds:${sportKey}`,
  subscribers: "odds:subscribers",
  paused: "odds:paused",
  queue: {
    poll: "odds-poll",
  },
  quota: {
    remaining: "odds:quota:remaining",
    used: "odds:quota:used",
    resetAt: "odds:quota:reset_at",
  },
};
