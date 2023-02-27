import { EventEmitter } from "events";
import { expireCookie, getCookie } from "../util/cookie";

const eventEmitter = new EventEmitter();
export const TOKEN_KEY = "@@TOKEN";
const TEMPORARY_JWT_COOKIE_NAME = "AJWT";

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

export function setTokenFromCookie(): void {
  const tokenFromCookie = getCookie(TEMPORARY_JWT_COOKIE_NAME);
  if (tokenFromCookie && !token) {
    setToken(tokenFromCookie);

    const cookieDomainParts = window.location.hostname.split(".");
    const temporaryCookieDomain = cookieDomainParts
      .slice(Math.max(cookieDomainParts.length - 2, 0))
      .join(".");

    expireCookie(TEMPORARY_JWT_COOKIE_NAME, temporaryCookieDomain);
  }
}

export function setToken(newToken: string) {
  token = newToken;
  localStorage.setItem(TOKEN_KEY, newToken);
  eventEmitter.emit("change", token);
}

export function unsetToken(): void {
  token = null;
  localStorage.removeItem(TOKEN_KEY);
  eventEmitter.emit("change", token);
}
