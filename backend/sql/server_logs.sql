CREATE OR REPLACE FUNCTION async.server_logs(_limit INT DEFAULT 1000)
RETURNS TABLE (happened TIMESTAMP, message TEXT) AS
$$
  SELECT happened, message
  FROM async.server_log
  ORDER BY happened DESC
  LIMIT _limit;
$$ LANGUAGE SQL;
