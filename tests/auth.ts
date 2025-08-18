export type User = {
  username: string;
  password: string;
  email?: string;
};

// Validate username
export function validateUsername(username: string): boolean {
  return typeof username === "string" && username.length >= 3;
}

// Validate password
export function validatePassword(password: string): boolean {
  return typeof password === "string" && password.length >= 6;
}

// Validate email (optional)
export function validateEmail(email: string): boolean {
  return typeof email === "string" && email.includes("@");
}

// Simple password reset
export function resetPassword(user: User, newPassword: string): string {
  if (!validatePassword(newPassword)) return "Password must be at least 6 characters.";
  user.password = newPassword;
  return `Password for ${user.username} has been reset.`;
}
