CREATE OR REPLACE FUNCTION async.concurrency_pool_info()
RETURNS JSONB AS
$$
  SELECT jsonb_agg(row_to_json(t))
  FROM (
    SELECT
      p.concurrency_pool AS pool,
      p.max_workers AS concurrency_limit,
      COUNT(t.task_id) AS active_tasks,
      ARRAY_AGG(t.task_id ORDER BY t.task_id) AS task_ids
    FROM async.concurrency_pool p
    LEFT JOIN flow.v_flow_task_status t
      ON p.concurrency_pool = t.target
     AND t.status IN ('Running', 'Running Async', 'Running Steps')
    GROUP BY p.concurrency_pool, p.max_workers
    ORDER BY p.concurrency_pool
  ) t;
$$ LANGUAGE SQL;

-- This function retrieves information about concurrency pools, including the pool name,
-- maximum number of workers, the count of active tasks, and the IDs of those tasks.
