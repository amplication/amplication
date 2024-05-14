import { EventEmitter } from "events";
import { CREDENTIALS_LOCAL_STORAGE_ITEM } from "./constants";
import { Credentials } from "./types";

const eventEmitter = new EventEmitter();

export function isAuthenticated(): boolean {
  return Boolean(getCredentials());
}

export function listen(listener: (authenticated: boolean) => void): void {
  eventEmitter.on("change", () => {
    listener(isAuthenticated());
  });
}

export function setCredentials(credentials: Credentials) {
  localStorage.setItem(
    CREDENTIALS_LOCAL_STORAGE_ITEM,
    JSON.stringify(credentials)
  );
}

export function getCredentials(): Credentials | null {
  const raw = localStorage.getItem(CREDENTIALS_LOCAL_STORAGE_ITEM);
  if (raw === null) {
    return null;
  }
  return JSON.parse(raw);
}

export function removeCredentials(): void {
  localStorage.removeItem(CREDENTIALS_LOCAL_STORAGE_ITEM);
}
