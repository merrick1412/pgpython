DROP FUNCTION IF EXISTS async.concurrency_pool_info();

CREATE FUNCTION async.concurrency_pool_info()
RETURNS JSONB AS
$$
  SELECT jsonb_agg(row_to_json(t))
  FROM (
    SELECT
      concurrency_pool AS pool,
      max_workers AS concurrency_limit,
      0 AS active_tasks --PLACEHOLDER, must be fixed later
    FROM async.concurrency_pool
    ORDER BY concurrency_pool
  ) t;
$$ LANGUAGE SQL;
