import type { User } from "./auth";
import { validateUsername, validatePassword } from "./auth";

export function signup(username: string, password: string): string {
  if (!validateUsername(username)) {
    return "Invalid username. Must be at least 3 characters.";
  }
  if (!validatePassword(password)) {
    return "Invalid password. Must be at least 6 characters.";
  }

  const newUser: User = { username, password };
  return `User ${newUser.username} signed up successfully.`;
}
