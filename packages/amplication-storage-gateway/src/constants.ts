import { join } from "path";

export const JWT_SECRET_KEY = "JWT_SECRET_KEY";
export const BASE_BUILDS_FOLDER = "BASE_BUILDS_FOLDER";
export const CHECK_USER_ACCESS_TOPIC = "CHECK_USER_ACCESS_TOPIC";
export const DOT_AMPLICATION_FOLDER = join(
  process.cwd(),
  "..",
  "..",
  ".amplication"
);
export const DEFAULT_BUILDS_FOLDER = join(
  DOT_AMPLICATION_FOLDER,
  "storage",
  "builds"
);
