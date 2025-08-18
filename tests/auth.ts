// auth.ts
/**
 * Authentication utilities and types for the authentication system
 */

export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
  role: UserRole;
  profilePicture?: string;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
  GUEST = 'guest'
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: Partial<User>;
  token?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates if username meets minimum requirements
 * @param username - The username to validate
 * @returns boolean indicating if username is valid
 */
export function validateUsername(username: string): ValidationResult {
  const errors: string[] = [];

  if (typeof username !== "string") {
    errors.push("Username must be a string");
  }

  if (!username || username.trim().length === 0) {
    errors.push("Username is required");
  }

  if (username.length < 3) {
    errors.push("Username must be at least 3 characters long");
  }

  if (username.length > 30) {
    errors.push("Username must be no more than 30 characters long");
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.push("Username can only contain letters, numbers, underscores, and hyphens");
  }

  if (/^[0-9]/.test(username)) {
    errors.push("Username cannot start with a number");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Checks if password meets security criteria
 * @param password - The password to validate
 * @returns ValidationResult with validation status and any errors
 */
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];

  if (typeof password !== "string") {
    errors.push("Password must be a string");
  }

  if (!password) {
    errors.push("Password is required");
  }

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (password.length > 128) {
    errors.push("Password must be no more than 128 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates email format
 * @param email - The email to validate
 * @returns ValidationResult with validation status and any errors
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];

  if (typeof email !== "string") {
    errors.push("Email must be a string");
  }

  if (!email || email.trim().length === 0) {
    errors.push("Email is required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push("Please enter a valid email address");
  }

  if (email.length > 254) {
    errors.push("Email address is too long");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Generates a unique user ID
 * @returns string - A unique identifier
 */
export function generateUserId(): string {
  return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

/**
 * Hash password (simplified version - in production use bcrypt)
 * @param password - Plain text password
 * @returns Hashed password
 */
export function hashPassword(password: string): string {
  // This is a simplified hash - use bcrypt in production
  return btoa(password + 'salt_key_secret').replace(/[^a-zA-Z0-9]/g, '');
}
