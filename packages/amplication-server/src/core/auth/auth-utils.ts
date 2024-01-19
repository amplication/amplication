import * as crypto from "crypto";

export function generateRandomString(): string {
  return crypto.randomBytes(10).toString("hex");
}

export function generateRandomEmail(): string {
  return `fake-${generateRandomString()}@amplication.com`;
}
