SELECT add_retention_policy(
  '"OddsSnapshot"',
  INTERVAL '30 days',
  if_not_exists => TRUE
);
