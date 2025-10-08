/* eslint-disable */
export class Env {
  static readonly PORT = "PORT";

  static readonly DSG_RUNNER_URL = "DSG_RUNNER_URL";

  static readonly REDIS_HOST = "REDIS_HOST";
  static readonly REDIS_PORT = "REDIS_PORT";
  static readonly REDIS_USERNAME = "REDIS_USERNAME";
  static readonly REDIS_PASSWORD = "REDIS_PASSWORD";
  static readonly REDIS_TLS_CA = "REDIS_TLS_CA";
  static readonly REDIS_TLS_CERT = "REDIS_TLS_CERT";
  static readonly REDIS_TLS_KEY = "REDIS_TLS_KEY";

  static readonly BUILD_ARTIFACTS_BASE_FOLDER = "BUILD_ARTIFACTS_BASE_FOLDER";
  static readonly BUILD_ARTIFACTS_CODE_FOLDER = "BUILD_ARTIFACTS_CODE_FOLDER";

  static readonly DSG_JOBS_BASE_FOLDER = "DSG_JOBS_BASE_FOLDER";
  static readonly DSG_ASSETS_FOLDER = "DSG_ASSETS_FOLDER";
  static readonly DSG_JOBS_CODE_FOLDER = "DSG_JOBS_CODE_FOLDER";
  static readonly DSG_JOBS_RESOURCE_DATA_FILE = "DSG_JOBS_RESOURCE_DATA_FILE";
  static readonly FEATURE_SPLIT_JOBS_MIN_DSG_VERSION =
    "FEATURE_SPLIT_JOBS_MIN_DSG_VERSION";

  static readonly DSG_CATALOG_SERVICE_URL = "DSG_CATALOG_SERVICE_URL";

  static readonly SERVICE_NAME = "amplication-build-manager";
  static readonly ENABLE_PACKAGE_MANAGER = "ENABLE_PACKAGE_MANAGER";

  static readonly DSG_RESOURCE_DATA_BASE_FOLDER =
    "DSG_RESOURCE_DATA_BASE_FOLDER";
  static readonly DSG_RESOURCE_DATA_FILE = "DSG_RESOURCE_DATA_FILE";
}
