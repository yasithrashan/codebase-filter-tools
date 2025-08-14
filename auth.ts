// auth.ts
export type User = {
  username: string;
  password: string;
};

export function validateUsername(username: string): boolean {
  return typeof username === "string" && username.length >= 3;
}

export function validatePassword(password: string): boolean {
  return typeof password === "string" && password.length >= 6;
}
