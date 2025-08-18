import type { User } from "./auth";
import { validateUsername, validatePassword, validateEmail } from "./auth";

export function signup(username: string, password: string, email?: string): User | string {
  if (!validateUsername(username)) return "Invalid username. Must be at least 3 characters.";
  if (!validatePassword(password)) return "Invalid password. Must be at least 6 characters.";
  if (email && !validateEmail(email)) return "Invalid email address.";

  const newUser: User = { username, password, email };
  return newUser;
}

// Example usage
const user = signup("charlie", "mypassword", "charlie@test.com");
console.log("Signed up user:", user);
