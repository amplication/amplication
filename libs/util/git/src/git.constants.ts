import { join } from "path";

export const REPO_NAME_TAKEN_ERROR_MESSAGE = "Repository is already exist";
export const INVALID_SOURCE_CONTROL_ERROR_MESSAGE =
  "Invalid source control service";
export const MISSING_TOKEN_ERROR = `App Missing a Github token. You should first complete the authorization process`;
export const GIT_REPOSITORY_EXIST =
  "Git Repository already connected to an other App";
export const INVALID_GIT_REPOSITORY_ID = "Git Repository does not exist";
export const UNSUPPORTED_GIT_ORGANIZATION_TYPE =
  "Creation of repositories in a personal account is not supported";
export const AMPLICATION_FOLDER = ".amplication";
export const AMPLICATION_IGNORED_FOLDER = join(AMPLICATION_FOLDER, "ignored");
