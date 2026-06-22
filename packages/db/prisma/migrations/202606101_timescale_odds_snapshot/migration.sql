CREATE EXTENSION IF NOT EXISTS timescaledb;

SELECT create_hypertable(
  '"OddsSnapshot"',
  'capturedAt',
  if_not_exists => TRUE
);