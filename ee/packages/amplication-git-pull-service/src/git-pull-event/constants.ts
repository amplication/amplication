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

// TODO: should be an enum
// eslint-disable-next-line @typescript-eslint/naming-convention
export const LoggerMessages = {
  log: {
    GENERATE_OCTOKIT_ACCESS_TOKEN: "generate access token with octokit",
    NEW_GIT_PULL_EVENT_RECORD_CREATED: "create new git pull event record on DB",
    FOUND_PREVIOUS_READY_COMMIT: "found previous ready commit",
    CLONE_SUCCESS: "clone successfully",
    PULL_SUCCESS: "pull successfully",
    COPY_SUCCESS: "copy successfully",
    DELETE_SUCCESSFULLY:
      "update record status to Deleted and delete from storage",
  },
  error: {
    CATCH_ERROR_MESSAGE: "error from:",
  },
  debug: {},
};
