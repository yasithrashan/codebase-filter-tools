import type { User } from "./auth";
import type { AuthResult } from "./auth";
import { UserRole } from "./auth";
import type { LoginCredentials } from "./auth";

/**
 * Mock database of users for authentication
 */
const mockUsers: User[] = [
  {
    id: "user_alice_001",
    username: "alice",
    password: "cGFzc3dvcmQxMjNzYWx0X2tleV9zZWNyZXQ", // hashed "password123"
    email: "alice@example.com",
    firstName: "Alice",
    lastName: "Johnson",
    isActive: true,
    createdAt: new Date("2024-01-15"),
    lastLoginAt: new Date("2024-08-10"),
    role: UserRole.USER,
    profilePicture: "https://example.com/avatars/alice.jpg"
  },
  {
    id: "user_bob_002",
    username: "bob",
    password: "bXlwYXNzd29yZHNhbHRfa2V5X3NlY3JldA", // hashed "mypassword"
    email: "bob@example.com",
    firstName: "Bob",
    lastName: "Smith",
    isActive: true,
    createdAt: new Date("2024-02-20"),
    lastLoginAt: new Date("2024-08-12"),
    role: UserRole.MODERATOR
  },
  {
    id: "user_admin_003",
    username: "admin",
    password: "YWRtaW4xMjNzYWx0X2tleV9zZWNyZXQ", // hashed "admin123"
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "User",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    lastLoginAt: new Date("2024-08-18"),
    role: UserRole.ADMIN
  }
];

/**
 * Session storage for logged-in users
 */
const activeSessions: Map<string, { user: User; token: string; expiresAt: Date }> = new Map();

/**
 * Generate a session token
 * @returns string - Session token
 */
function generateSessionToken(): string {
  return 'token_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 16);
}

/**
 * Hash password for comparison (simplified)
 * @param password - Plain text password
 * @returns Hashed password
 */
function hashPasswordForLogin(password: string): string {
  return btoa(password + 'salt_key_secret').replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Authenticates user with username and password against mock database
 * @param credentials - Login credentials containing username and password
 * @returns AuthResult with success status, message, and user data if successful
 */
export function login(credentials: LoginCredentials): AuthResult {
  const { username, password, rememberMe = false } = credentials;

  // Input validation
  if (!username || typeof username !== 'string') {
    return {
      success: false,
      message: "Username is required and must be a valid string."
    };
  }

  if (!password || typeof password !== 'string') {
    return {
      success: false,
      message: "Password is required and must be a valid string."
    };
  }

  // Find user by username (case-insensitive)
  const user = mockUsers.find(u =>
    u.username.toLowerCase() === username.toLowerCase()
  );

  if (!user) {
    return {
      success: false,
      message: "Username not found. Please check your credentials or sign up."
    };
  }

  // Check if user account is active
  if (!user.isActive) {
    return {
      success: false,
      message: "Your account has been deactivated. Please contact support."
    };
  }

  // Verify password
  const hashedPassword = hashPasswordForLogin(password);
  if (user.password !== hashedPassword) {
    return {
      success: false,
      message: "Incorrect password. Please try again."
    };
  }

  // Generate session token
  const token = generateSessionToken();
  const expirationTime = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 30 days or 1 day
  const expiresAt = new Date(Date.now() + expirationTime);

  // Store session
  activeSessions.set(token, {
    user,
    token,
    expiresAt
  });

  // Update last login time
  user.lastLoginAt = new Date();

  return {
    success: true,
    message: `Welcome back, ${user.firstName}! You have been logged in successfully.`,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      lastLoginAt: user.lastLoginAt
    },
    token
  };
}

/**
 * Get user by session token
 * @param token - Session token
 * @returns User if valid session, null otherwise
 */
export function getUserByToken(token: string): User | null {
  const session = activeSessions.get(token);

  if (!session) {
    return null;
  }

  // Check if session has expired
  if (new Date() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }

  return session.user;
}

/**
 * Get all active sessions (admin function)
 * @returns Array of active session information
 */
export function getActiveSessions(): Array<{userId: string, username: string, expiresAt: Date}> {
  const sessions: Array<{userId: string, username: string, expiresAt: Date}> = [];

  for (const [token, session] of activeSessions.entries()) {
    if (new Date() <= session.expiresAt) {
      sessions.push({
        userId: session.user.id,
        username: session.user.username,
        expiresAt: session.expiresAt
      });
    } else {
      // Clean up expired sessions
      activeSessions.delete(token);
    }
  }

  return sessions;
}

// Example usage
console.log("=== Login Examples ===");
console.log(login({ username: "alice", password: "password123" }));
console.log(login({ username: "bob", password: "wrongpass" }));
console.log(login({ username: "admin", password: "admin123", rememberMe: true }));