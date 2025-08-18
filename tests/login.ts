import type { User } from "./auth";
import { validateUsername, validatePassword } from "./auth";

const mockUsers: User[] = [
  { username: "alice", password: "password123", email: "alice@test.com" },
  { username: "bob", password: "mypassword", email: "bob@test.com" }
];

let currentUser: string | null = null;

export function login(username: string, password: string): string {
  const user = mockUsers.find(u => u.username === username);
  if (!user) return "Username not found.";
  if (user.password !== password) return "Incorrect password.";

  currentUser = username; // track current user
  return `User ${username} logged in successfully.`;
}

export function getCurrentUser() {
  return currentUser;
}

export function setCurrentUser(username: string | null) {
  currentUser = username;
}

console.log(login("alice", "password123"));
console.log("Current user:", getCurrentUser());
