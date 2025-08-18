// signup.ts
import type { User, SignupData, AuthResult, ValidationResult } from "./auth";
import { UserRole, validateUsername, validatePassword, validateEmail, generateUserId, hashPassword } from "./auth";

/**
 * Storage for registered users (in production, this would be a database)
 */
const registeredUsers: User[] = [];

/**
 * Reserved usernames that cannot be registered
 */
const RESERVED_USERNAMES = [
  'admin', 'administrator', 'root', 'system', 'api', 'support',
  'help', 'info', 'contact', 'service', 'null', 'undefined'
];

/**
 * Email blacklist for domains that are not allowed
 */
const BLACKLISTED_DOMAINS = [
  'tempmail.org', '10minutemail.com', 'guerrillamail.com'
];

/**
 * Check if username is already taken
 * @param username - Username to check
 * @returns boolean indicating if username exists
 */
function isUsernameTaken(username: string): boolean {
  return registeredUsers.some(user =>
    user.username.toLowerCase() === username.toLowerCase()
  );
}

/**
 * Check if email is already registered
 * @param email - Email to check
 * @returns boolean indicating if email exists
 */
function isEmailTaken(email: string): boolean {
  return registeredUsers.some(user =>
    user.email.toLowerCase() === email.toLowerCase()
  );
}

/**
 * Check if username is reserved
 * @param username - Username to check
 * @returns boolean indicating if username is reserved
 */
function isUsernameReserved(username: string): boolean {
  return RESERVED_USERNAMES.includes(username.toLowerCase());
}

/**
 * Check if email domain is blacklisted
 * @param email - Email to check
 * @returns boolean indicating if domain is blacklisted
 */
function isEmailDomainBlacklisted(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? BLACKLISTED_DOMAINS.includes(domain) : false;
}

/**
 * Validate name fields
 * @param name - Name to validate
 * @param fieldName - Field name for error messages
 * @returns ValidationResult
 */
function validateName(name: string, fieldName: string): ValidationResult {
  const errors: string[] = [];

  if (!name || typeof name !== 'string') {
    errors.push(`${fieldName} is required`);
  } else {
    if (name.trim().length < 2) {
      errors.push(`${fieldName} must be at least 2 characters long`);
    }

    if (name.length > 50) {
      errors.push(`${fieldName} must be no more than 50 characters long`);
    }

    if (!/^[a-zA-Z\s'-]+$/.test(name)) {
      errors.push(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate all signup data
 * @param signupData - The signup data to validate
 * @returns ValidationResult with all validation errors
 */
function validateSignupData(signupData: SignupData): ValidationResult {
  const allErrors: string[] = [];

  // Validate username
  const usernameValidation = validateUsername(signupData.username);
  allErrors.push(...usernameValidation.errors);

  if (usernameValidation.isValid) {
    if (isUsernameReserved(signupData.username)) {
      allErrors.push("Username is reserved and cannot be used");
    }

    if (isUsernameTaken(signupData.username)) {
      allErrors.push("Username is already taken. Please choose a different one.");
    }
  }

  // Validate password
  const passwordValidation = validatePassword(signupData.password);
  allErrors.push(...passwordValidation.errors);

  // Validate password confirmation
  if (signupData.password !== signupData.confirmPassword) {
    allErrors.push("Passwords do not match");
  }

  // Validate email
  const emailValidation = validateEmail(signupData.email);
  allErrors.push(...emailValidation.errors);

  if (emailValidation.isValid) {
    if (isEmailDomainBlacklisted(signupData.email)) {
      allErrors.push("Email domain is not allowed");
    }

    if (isEmailTaken(signupData.email)) {
      allErrors.push("Email address is already registered. Please use a different email or try logging in.");
    }
  }

  // Validate first name
  const firstNameValidation = validateName(signupData.firstName, "First name");
  allErrors.push(...firstNameValidation.errors);

  // Validate last name
  const lastNameValidation = validateName(signupData.lastName, "Last name");
  allErrors.push(...lastNameValidation.errors);

  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
}

/**
 * Creates new user account after validating credentials
 * @param signupData - User registration data
 * @returns AuthResult indicating success or failure with appropriate message
 */
export function signup(signupData: SignupData): AuthResult {
  // Validate all input data
  const validation = validateSignupData(signupData);

  if (!validation.isValid) {
    return {
      success: false,
      message: `Registration failed. Please fix the following issues: ${validation.errors.join(', ')}`
    };
  }

  try {
    // Create new user
    const newUser: User = {
      id: generateUserId(),
      username: signupData.username.trim(),
      password: hashPassword(signupData.password),
      email: signupData.email.toLowerCase().trim(),
      firstName: signupData.firstName.trim(),
      lastName: signupData.lastName.trim(),
      isActive: true,
      createdAt: new Date(),
      role: UserRole.USER
    };

    // Add user to registered users
    registeredUsers.push(newUser);

    return {
      success: true,
      message: `Welcome ${newUser.firstName}! Your account has been created successfully. You can now log in with your credentials.`,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    };

  } catch (error) {
    console.error('Signup error:', error);
    return {
      success: false,
      message: "An unexpected error occurred during registration. Please try again later."
    };
  }
}

/**
 * Get user by username (for testing purposes)
 * @param username - Username to search for
 * @returns User object or null if not found
 */
export function getUserByUsername(username: string): User | null {
  return registeredUsers.find(user =>
    user.username.toLowerCase() === username.toLowerCase()
  ) || null;
}

/**
 * Get user by email (for testing purposes)
 * @param email - Email to search for
 * @returns User object or null if not found
 */
export function getUserByEmail(email: string): User | null {
  return registeredUsers.find(user =>
    user.email.toLowerCase() === email.toLowerCase()
  ) || null;
}

/**
 * Get all registered users count (admin function)
 * @returns Number of registered users
 */
export function getRegisteredUsersCount(): number {
  return registeredUsers.length;
}

/**
 * Get user registration statistics
 * @returns Object with registration statistics
 */
export function getRegistrationStats() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return {
    totalUsers: registeredUsers.length,
    activeUsers: registeredUsers.filter(user => user.isActive).length,
    recentSignups30Days: registeredUsers.filter(user => user.createdAt >= thirtyDaysAgo).length,
    recentSignups7Days: registeredUsers.filter(user => user.createdAt >= sevenDaysAgo).length,
    usersByRole: {
      admin: registeredUsers.filter(user => user.role === UserRole.ADMIN).length,
      moderator: registeredUsers.filter(user => user.role === UserRole.MODERATOR).length,
      user: registeredUsers.filter(user => user.role === UserRole.USER).length,
      guest: registeredUsers.filter(user => user.role === UserRole.GUEST).length
    }
  };
}

// Example usage
console.log("=== Signup Examples ===");

console.log(signup({
  username: "charlie",
  password: "SecurePass123!",
  confirmPassword: "SecurePass123!",
  email: "charlie@example.com",
  firstName: "Charlie",
  lastName: "Brown"
}));

console.log(signup({
  username: "dave",
  password: "weak",
  confirmPassword: "weak",
  email: "dave@example.com",
  firstName: "Dave",
  lastName: "Wilson"
}));

console.log(signup({
  username: "admin",
  password: "AdminPass123!",
  confirmPassword: "AdminPass123!",
  email: "admin2@example.com",
  firstName: "Admin",
  lastName: "User"
}));