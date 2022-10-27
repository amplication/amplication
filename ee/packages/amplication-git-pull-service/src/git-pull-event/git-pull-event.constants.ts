import { join } from "path";

export const DOT_AMPLICATION_FOLDER = join(
  process.cwd(),
  "..",
  "..",
  ".amplication"
);
export const DEFAULT_GITHUB_PULL_FOLDER = join(
  DOT_AMPLICATION_FOLDER,
  "storage",
  "github",
  "pulls"
);

// TODO: should be an enum
// eslint-disable-next-line @typescript-eslint/naming-convention
export const ErrorMessages = {
  ACCESS_TOKEN_ERROR: "failed to create new access token",
  CREATE_NEW_RECORD_ERROR: "failed to create a new record in DB",
  UPDATE_RECORD_ERROR: "failed to update a record in DB",
  PREVIOUS_READY_COMMIT_NOT_FOUND_ERROR:
    "failed to find previous ready commit in DB",
  REPOSITORY_CLONE_FAILURE: "failed to clone a repository",
  REPOSITORY_PULL_FAILURE: "failed to pull a repository",
  COPY_DIR_FAILURE: "failed to copy files from srcDir to destDir",
  CLEAN_DIR_FAILURE: "failed to remove non-code files from srcDir",
  GIT_HOST_PROVIDER_ERROR: "Invalid source control service",
};
