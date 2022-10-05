import { EventEmitter } from "events";

const eventEmitter = new EventEmitter();
const TOKEN_KEY = "@@TOKEN";

let token: string | null;

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

export function listen(listener: (authenticated: boolean) => void): void {
  eventEmitter.on("change", () => {
    listener(isAuthenticated());
  });
}

export function getToken(): string | null {
  if (token === undefined) {
    token = localStorage.getItem(TOKEN_KEY);
  }
  return token;
}

export function setToken(newToken: string) {
  token = newToken;
  localStorage.setItem(TOKEN_KEY, newToken);
  eventEmitter.emit("change", token);
}

export function unsetToken() {
  token = null;
  localStorage.removeItem(TOKEN_KEY);
  eventEmitter.emit("change", token);
}
