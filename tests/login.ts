// login.ts
import type { User } from "./auth";

export function login(username: string, password: string): string {
  const mockUsers: User[] = [
    { username: "alice", password: "password123" },
    { username: "bob", password: "mypassword" }
  ];

  const user = mockUsers.find(u => u.username === username);

  if (!user) {
    return "Username not found.";
  }

  if (user.password !== password) {
    return "Incorrect password.";
  }

  return `User ${username} logged in successfully.`;
}

console.log(login("alice", "password123"));
console.log(login("bob", "wrongpass"));
