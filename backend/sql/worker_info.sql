CREATE OR REPLACE FUNCTION async.worker_info()
RETURNS JSONB AS
$$
BEGIN
  RETURN (
    SELECT jsonb_agg(q)
    FROM (
      SELECT 
        slot,
        w.target,
        task_id,
        running_since,
        query, 
        priority
      FROM async.worker w
      LEFT JOIN async.task t USING(task_id)
      ORDER BY slot
    ) q
  );
END;
$$ LANGUAGE plpgsql;
