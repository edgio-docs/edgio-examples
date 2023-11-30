import { connect } from '@planetscale/database';

// polyfill required classes for Planetscale
import '../../utils/polyfills/Buffer';
import '../../utils/polyfills/URL';

import createFetchWithOrigin from '../../utils/createFetchForOrigin';
import {
  TOTAL_ACTIVE_SESSIONS,
  ACTIVE_SESSION_DURATION_SECONDS,
  QUEUED_SESSION_DURATION_SECONDS,
  CREATE_SESSION_QUERY,
  GET_SESSION_QUERY,
  EXPIRE_SESSIONS_QUERY,
  GET_SESSION_ID_QUERY,
  REFRESH_SESSION_QUERY,
  AVAILABLE_STATUS_QUERY,
} from './constants';

const fetch = createFetchWithOrigin('planetscale');

let _conn = null;

function getConnection() {
  // define PLANETSCALE_USERNAME and PLANETSCALE_PASSWORD in a local .env file
  // and in the Edgio Developer Console. Those values will be injected into
  // the `context.environmentVars` property.
  const config = {
    host: process.env.PLANETSCALE_HOST,
    username: process.env.PLANETSCALE_USERNAME,
    password: process.env.PLANETSCALE_PASSWORD,
    fetch,
  };

  if (!_conn) {
    _conn = connect(config);
  }

  return _conn;
}

/**
 * Gets the current session information, including session counts.
 *
 * @param {string} sessionId
 * @returns {Promise<{session: {sessionId: string, status: string, position: number}, activeCount: number, queuedCount: number}>}
 */
export async function getSessionData(sessionId = null) {
  const conn = getConnection();

  // Validate the session ID, or generate a new one if the ID is invalid
  sessionId = await getSessionID(sessionId);

  // Create a new session, active or queued depending on the current number of active sessions
  const res = await conn.execute(CREATE_SESSION_QUERY, {
    id: sessionId,
    sessionsLimit: TOTAL_ACTIVE_SESSIONS,
  });

  if (res.rowsAffected > 0) {
    console.log(`Created new session: ${sessionId}`);
  } else {
    // Refresh the session if it already exists
    await refreshSession(sessionId);
    console.log(`Using existing session: ${sessionId}`);
  }

  // Get the current session information including total active and queued sessions
  const sessionRes = await conn.execute(GET_SESSION_QUERY, {
    id: sessionId,
  });

  const data = sessionRes.rows[0];

  return {
    session: {
      sessionId: data.sessionId,
      status: data.status,
      position: data.position,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    },
    activeCount: data.active_count,
    queuedCount: data.queued_count,
  };
}

/**
 * Validates the session ID, or generates a new one if the ID is invalid. Also removes expired sessions.
 *
 * @param {string} sessionId
 * @returns {Promise<string>}
 */
async function getSessionID(sessionId) {
  const conn = getConnection();

  // Expire stale sessions prior to validating the session ID
  await expireSessions();

  const res = await conn.execute(GET_SESSION_ID_QUERY, { id: sessionId });

  if (res.rows.length !== 1) {
    throw new Error('Invalid session ID');
  }

  return res.rows[0].sessionId;
}

/**
 * Refreshes the session if the ID is valid.
 *
 * @param {string} sessionId
 * @returns {Promise<{sessionId: string, updatedAt: Date}>}
 */
export async function refreshSession(sessionId) {
  const conn = getConnection();

  const updatedAt = new Date();

  // Check if there is a spot available in the active sessions before refreshing the session
  const status = await getAvailableStatus();

  const res = await conn.execute(REFRESH_SESSION_QUERY, {
    id: sessionId,
    date: updatedAt,
    status,
  });

  return res.rowsAffected === 1 ? { sessionId, updatedAt } : null;
}

/**
 * Expires sessions that have not been updated within the specified duration.
 *
 * @returns {Promise<void>}
 */
async function expireSessions() {
  const conn = getConnection();

  const res = await conn.execute(EXPIRE_SESSIONS_QUERY, {
    activeDuration: ACTIVE_SESSION_DURATION_SECONDS,
    queuedDuration: QUEUED_SESSION_DURATION_SECONDS,
  });

  console.log('Expired sessions removed:', res.rowsAffected);
}

async function getAvailableStatus() {
  const conn = getConnection();

  const res = await conn.execute(AVAILABLE_STATUS_QUERY, {
    sessionsLimit: TOTAL_ACTIVE_SESSIONS,
  });

  return res.rows[0].newStatus;
}
