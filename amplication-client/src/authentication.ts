const TOKEN_KEY = "@@TOKEN";

let token: string | null;

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

export function getToken(): string | null {
  if (token === undefined) {
    token = localStorage.getItem(TOKEN_KEY);
  }
  return token;
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}
