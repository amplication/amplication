/* eslint-disable @typescript-eslint/naming-convention */

export class Env {
  static readonly PORT = "PORT";

  static readonly BITBUCKET_CLIENT_ID = "BITBUCKET_CLIENT_ID";
  static readonly BITBUCKET_CLIENT_SECRET = "BITBUCKET_CLIENT_SECRET";

  static readonly GITLAB_CLIENT_ID = "GITLAB_CLIENT_ID";
  static readonly GITLAB_CLIENT_SECRET = "GITLAB_CLIENT_SECRET";
  static readonly GITLAB_REDIRECT_URI = "GITLAB_REDIRECT_URI";

  static readonly GITHUB_APP_CLIENT_ID = "GITHUB_APP_CLIENT_ID";
  static readonly GITHUB_APP_CLIENT_SECRET = "GITHUB_APP_CLIENT_SECRET";
  static readonly GITHUB_APP_APP_ID = "GITHUB_APP_APP_ID";
  static readonly GITHUB_APP_INSTALLATION_URL = "GITHUB_APP_INSTALLATION_URL";
  static readonly GITHUB_APP_PRIVATE_KEY = "GITHUB_APP_PRIVATE_KEY";

  static readonly CREATE_PR_REQUEST_TOPIC = "CREATE_PR_REQUEST_TOPIC";
  static readonly CREATE_PR_SUCCESS_TOPIC = "CREATE_PR_SUCCESS_TOPIC";
  static readonly CREATE_PR_FAILURE_TOPIC = "CREATE_PR_FAILURE_TOPIC";

  static readonly BUILD_ARTIFACTS_BASE_FOLDER = "BUILD_ARTIFACTS_BASE_FOLDER";
  static readonly BUILD_ARTIFACTS_CODE_FOLDER = "BUILD_ARTIFACTS_CODE_FOLDER";
  static readonly SERVICE_NAME = "git-sync-manager";

  static readonly CLONES_FOLDER = "CLONES_FOLDER";
  static readonly DSG_ASSETS_FOLDER = "DSG_ASSETS_FOLDER";
}
