// signout.ts
export function signout(currentUser?: string): string {
  if (!currentUser) {
    return "No user is currently logged in.";
  }

  return `User ${currentUser} signed out successfully.`;
}


console.log(signout("alice"));
console.log(signout());
