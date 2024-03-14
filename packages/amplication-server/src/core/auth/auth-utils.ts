import * as crypto from "crypto";
import { PUBLIC_DOMAINS } from "./publicDomains";
import { AmplicationError } from "../../errors/AmplicationError";
const WORK_EMAIL_INVALID = `Email must be a work email address`;

export function generateRandomString(): string {
  return crypto.randomBytes(10).toString("hex");
}

export function generateRandomEmail(): string {
  return `fake-${generateRandomString()}@amplication.com`;
}

/**
 * at least 8 characters
 * at least 1 lowercase letter
 * at least 1 uppercase letter
 * at least 1 number
 * at least 1 special character
 */
export function generatePassword() {
  let password = "";
  const passwordLength = 8;
  const passwordRequirements = [
    "abcdefghijklmnopqrstuvwxyz",
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "0123456789",
    "!@#$%^&*()_+",
  ];

  const charset = passwordRequirements.join("");
  while (password.length < passwordLength) {
    const byteBuffer = new Uint8Array(1);
    crypto.getRandomValues(byteBuffer);
    const index = byteBuffer[0] % charset.length;
    password += charset[index];
  }

  passwordRequirements.forEach((type) => {
    if (!password.split("").some((char) => type.includes(char))) {
      const byteBuffer = new Uint8Array(1);
      crypto.getRandomValues(byteBuffer);
      const index = byteBuffer[0] % type.length;
      const insertAt = Math.floor(Math.random() * password.length);
      password =
        password.slice(0, insertAt) + type[index] + password.slice(insertAt);
    }
  });

  return password;
}

export function validateWorkEmail(email: string) {
  if (!isValidWorkEmail(email)) {
    throw new AmplicationError(WORK_EMAIL_INVALID);
  }
}

export function isValidWorkEmail(email: string): boolean {
  const domain = email.split("@")[1];
  return !PUBLIC_DOMAINS.includes(domain);
}
