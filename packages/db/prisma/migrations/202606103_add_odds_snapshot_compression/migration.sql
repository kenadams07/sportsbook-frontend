ALTER TABLE "OddsSnapshot" SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = '"eventId",bookmaker,market,outcome',
  timescaledb.compress_orderby = '"capturedAt" DESC'
);

SELECT add_compression_policy(
  '"OddsSnapshot"',
  INTERVAL '7 days',
  if_not_exists => TRUE
);