CREATE OR REPLACE FUNCTION async.orchestrator_info() RETURNS JSONB AS
$$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'is_up', (SELECT pid IS NOT NULL FROM async.control),
    'uptime', (SELECT now() - running_since FROM async.control),
    'last_heavy_maintenance', (SELECT last_heavy_maintenance FROM async.control),
    'num_workers', (SELECT count(*) FROM async.worker),
    'tasks_running', (SELECT count(*) FROM async.task WHERE consumed IS NOT NULL AND processed IS NULL),
    'tasks_pending', (SELECT count(*) FROM async.task WHERE consumed IS NULL AND processed IS NULL)
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
-- This function retrieves information about the orchestrator's status, including whether it is up,
-- its uptime, the last heavy maintenance time, the number of workers, and counts of running and pending tasks.