// signout.ts
/**
 * User session management for signout functionality
 */

import type { AuthResult } from "./auth";

/**
 * Active user sessions storage
 */
const userSessions: Map<string, {
  username: string;
  loginTime: Date;
  lastActivity: Date;
  ipAddress?: string;
  userAgent?: string;
}> = new Map();

/**
 * Add a user session
 * @param username - Username of the logged-in user
 * @param sessionData - Additional session information
 * @returns Session token
 */
export function addSession(username: string, sessionData?: {
  ipAddress?: string;
  userAgent?: string;
}): string {
  const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date();

  userSessions.set(sessionToken, {
    username,
    loginTime: now,
    lastActivity: now,
    ipAddress: sessionData?.ipAddress,
    userAgent: sessionData?.userAgent
  });

  return sessionToken;
}

/**
 * Update user activity timestamp
 * @param sessionToken - Session token to update
 */
export function updateActivity(sessionToken: string): void {
  const session = userSessions.get(sessionToken);
  if (session) {
    session.lastActivity = new Date();
    userSessions.set(sessionToken, session);
  }
}

/**
 * Get session information
 * @param sessionToken - Session token
 * @returns Session data or null if not found
 */
export function getSession(sessionToken: string) {
  return userSessions.get(sessionToken) || null;
}

/**
 * Sign out a user from the system
 * @param currentUser - Username of currently logged-in user (optional)
 * @param sessionToken - Session token for the user (optional)
 * @returns AuthResult indicating success or failure of signout
 */
export function signout(currentUser?: string, sessionToken?: string): AuthResult {
  // Case 1: No user provided and no session token
  if (!currentUser && !sessionToken) {
    return {
      success: false,
      message: "No user is currently logged in. Please log in first to sign out."
    };
  }

  // Case 2: Session token provided
  if (sessionToken) {
    const session = userSessions.get(sessionToken);

    if (!session) {
      return {
        success: false,
        message: "Invalid session token. User may have already signed out."
      };
    }

    const username = session.username;
    const sessionDuration = new Date().getTime() - session.loginTime.getTime();
    const durationMinutes = Math.round(sessionDuration / (1000 * 60));

    // Remove the session
    userSessions.delete(sessionToken);

    return {
      success: true,
      message: `User ${username} signed out successfully. Session duration: ${durationMinutes} minutes.`
    };
  }

  // Case 3: Username provided - find and remove all sessions for this user
  if (currentUser) {
    let sessionsRemoved = 0;
    let sessionDuration = 0;

    // Find all sessions for this user
    for (const [token, session] of userSessions.entries()) {
      if (session.username === currentUser) {
        if (sessionsRemoved === 0) {
          // Calculate duration for the first session found
          sessionDuration = new Date().getTime() - session.loginTime.getTime();
        }
        userSessions.delete(token);
        sessionsRemoved++;
      }
    }

    if (sessionsRemoved === 0) {
      return {
        success: false,
        message: `No active sessions found for user ${currentUser}.`
      };
    }

    const durationMinutes = Math.round(sessionDuration / (1000 * 60));
    const sessionText = sessionsRemoved === 1 ? 'session' : 'sessions';

    return {
      success: true,
      message: `User ${currentUser} signed out successfully. ${sessionsRemoved} ${sessionText} terminated. Last session duration: ${durationMinutes} minutes.`
    };
  }

  return {
    success: false,
    message: "Unable to process signout request. Please try again."
  };
}

/**
 * Sign out all users (admin function)
 * @returns AuthResult with count of signed out users
 */
export function signoutAll(): AuthResult {
  const activeUsers = new Set<string>();

  // Collect unique usernames
  for (const session of userSessions.values()) {
    activeUsers.add(session.username);
  }

  const userCount = activeUsers.size;
  const sessionCount = userSessions.size;

  // Clear all sessions
  userSessions.clear();

  return {
    success: true,
    message: `All users signed out successfully. ${userCount} users and ${sessionCount} sessions terminated.`
  };
}

/**
 * Get active sessions count
 * @returns Number of active sessions
 */
export function getActiveSessionsCount(): number {
  return userSessions.size;
}

/**
 * Get all active users
 * @returns Array of active usernames with session info
 */
export function getActiveUsers(): Array<{
  username: string;
  loginTime: Date;
  lastActivity: Date;
  sessionDuration: number;
}> {
  const activeUsers: Array<{
    username: string;
    loginTime: Date;
    lastActivity: Date;
    sessionDuration: number;
  }> = [];

  const now = new Date().getTime();

  for (const session of userSessions.values()) {
    activeUsers.push({
      username: session.username,
      loginTime: session.loginTime,
      lastActivity: session.lastActivity,
      sessionDuration: Math.round((now - session.loginTime.getTime()) / (1000 * 60))
    });
  }

  return activeUsers;
}

/**
 * Clean up expired sessions (sessions inactive for more than 30 minutes)
 * @returns Number of sessions cleaned up
 */
export function cleanupInactiveSessions(): number {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  let cleanedCount = 0;

  for (const [token, session] of userSessions.entries()) {
    if (session.lastActivity < thirtyMinutesAgo) {
      userSessions.delete(token);
      cleanedCount++;
    }
  }

  return cleanedCount;
}

// Example usage
console.log("=== Signout Examples ===");

// Simulate adding some sessions
const aliceToken = addSession("alice", { ipAddress: "192.168.1.100" });
const bobToken = addSession("bob", { ipAddress: "192.168.1.101" });

console.log(signout("alice"));
console.log(signout(undefined, bobToken));
console.log(signout()); // No user logged in