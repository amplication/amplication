import { join } from "path";

export const JWT_SECRET_KEY = "JWT_SECRET_KEY";

export const BUILD_ARTIFACTS_BASE_FOLDER = "BUILD_ARTIFACTS_BASE_FOLDER";
export const BUILD_ARTIFACTS_CODE_FOLDER = "BUILD_ARTIFACTS_CODE_FOLDER";

export const CHECK_USER_ACCESS_TOPIC = "CHECK_USER_ACCESS_TOPIC";
export const DOT_AMPLICATION_FOLDER = join(process.cwd(), ".amplication");
console.log(DOT_AMPLICATION_FOLDER);

export const DEFAULT_BUILDS_FOLDER = join(
  DOT_AMPLICATION_FOLDER,
  "storage",
  "builds"
);
