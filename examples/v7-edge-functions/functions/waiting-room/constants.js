export const COOKIE_NAME_ID = '__edgio_session_id';
export const COOKIE_NAME_TIME = '__edgio_session_last_update_time';
export const TOTAL_ACTIVE_SESSIONS = 2;

// Active sessions should persist longer than queued sessions
export const ACTIVE_SESSION_DURATION_SECONDS = 150;
export const QUEUED_SESSION_DURATION_SECONDS = 15;

// Queries
export const CREATE_SESSION_QUERY = `
  -- Conditional insert if the session does not exist.
  -- This is cheaper than a SELECT followed by an INSERT.
  INSERT INTO sessions (sessionId, status, createdAt, updatedAt)
  SELECT
    :id,
    IF((SELECT COUNT(*) FROM sessions WHERE status = 'active') >= :sessionsLimit, 'queued', 'active'),
    NOW(),
    NOW()
  FROM dual
  WHERE NOT EXISTS (
      SELECT 1 FROM sessions WHERE sessionId = :id
  );
`;

export const GET_SESSION_QUERY = `
  -- Get the session data and the position in the queue.
  SELECT
    sessions_all.*,
    IF(sessions_all.status = 'queued', queued_info.position, -1) AS position,
    (SELECT COUNT(*) FROM sessions WHERE status = 'active') AS active_count,
    (SELECT COUNT(*) FROM sessions WHERE status = 'queued') AS queued_count
  FROM
    (SELECT
        sessionId,
      status,
      createdAt,
      updatedAt
    FROM sessions) AS sessions_all
  LEFT JOIN
    (SELECT
      sessionId,
      ROW_NUMBER() OVER (ORDER BY createdAt) AS position
    FROM sessions
    WHERE status = 'queued') AS queued_info
  ON sessions_all.sessionId = queued_info.sessionId
  WHERE sessions_all.sessionId = :id;
`;

export const EXPIRE_SESSIONS_QUERY = `
  DELETE FROM sessions WHERE 
    (updatedAt < DATE_SUB(NOW(), INTERVAL :activeDuration SECOND) AND status = 'active')
    OR (updatedAt < DATE_SUB(NOW(), INTERVAL :queuedDuration SECOND) AND status = 'queued');
`;

export const GET_SESSION_ID_QUERY = `
  SELECT sessionId FROM (
    SELECT sessionId FROM sessions WHERE sessionId = :id
    UNION ALL
    SELECT UUID() AS sessionId
    ORDER BY (sessionId IS NOT NULL) DESC
    LIMIT 1
  ) AS uuid_selection;
`;

export const REFRESH_SESSION_QUERY = `
  UPDATE sessions
  SET 
    updatedAt = :date, 
    status = :status
  WHERE sessionId = :id;
`;

export const AVAILABLE_STATUS_QUERY = `
SELECT IF(COUNT(*) < :sessionsLimit, 'active', 'queued') as newStatus
FROM sessions
WHERE status = 'active';
`;
