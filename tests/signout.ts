import { getCurrentUser, setCurrentUser } from "./login";

export function signout(): string {
  const user = getCurrentUser();
  if (!user) return "No user is currently logged in.";

  setCurrentUser(null); // clear current user
  return `User ${user} signed out successfully. You can log in again anytime.`;
}

// Example usage
console.log(signout());
