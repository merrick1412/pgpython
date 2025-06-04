CREATE OR REPLACE FUNCTION async.server_logs(_limit INT DEFAULT 1000)
RETURNS JSONB AS
$$
  SELECT jsonb_agg(message)
  FROM (
    SELECT message
    FROM async.server_log
    ORDER BY happened DESC
    LIMIT _limit
  ) sub;
$$ LANGUAGE SQL;
