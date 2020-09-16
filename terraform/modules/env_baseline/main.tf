# Provider

provider "google" {
  project = var.project
  region  = var.region
}

provider "google-beta" {
  project = var.project
  region  = var.region
}

# APIs

resource "google_project_service" "cloud_resource_manager_api" {
  service = "cloudresourcemanager.googleapis.com"
}

resource "google_project_service" "cloud_build_api" {
  service    = "cloudbuild.googleapis.com"
  depends_on = [google_project_service.cloud_resource_manager_api]
}

resource "google_project_service" "google_cloud_memorystore_for_redis_api" {
  service    = "redis.googleapis.com"
  depends_on = [google_project_service.cloud_resource_manager_api]
}

resource "google_project_service" "cloud_run_admin_api" {
  service    = "run.googleapis.com"
  depends_on = [google_project_service.cloud_resource_manager_api]
}

resource "google_project_service" "secret_manager_api" {
  service    = "secretmanager.googleapis.com"
  depends_on = [google_project_service.cloud_resource_manager_api]
}

resource "google_project_service" "service_management_api" {
  service    = "servicemanagement.googleapis.com"
  depends_on = [google_project_service.cloud_resource_manager_api]
}

resource "google_project_service" "service_usage_api" {
  service    = "serviceusage.googleapis.com"
  depends_on = [google_project_service.cloud_resource_manager_api]
}

resource "google_project_service" "cloud_sql" {
  service    = "sql-component.googleapis.com"
  depends_on = [google_project_service.cloud_resource_manager_api]
}

resource "google_project_service" "cloud_sql_admin_api" {
  service    = "sqladmin.googleapis.com"
  depends_on = [google_project_service.cloud_resource_manager_api]
}

resource "google_project_service" "google_cloud_storage_json_api" {
  service    = "storage-api.googleapis.com"
  depends_on = [google_project_service.cloud_resource_manager_api]
}

resource "google_project_service" "cloud_storage" {
  service    = "storage-component.googleapis.com"
  depends_on = [google_project_service.cloud_resource_manager_api]
}

resource "google_project_service" "cloud_storage_api" {
  service    = "storage.googleapis.com"
  depends_on = [google_project_service.cloud_resource_manager_api]
}

resource "google_project_service" "serverless_vpc_access_api" {
  service    = "vpcaccess.googleapis.com"
  depends_on = [google_project_service.cloud_resource_manager_api]
}

# Google SQL

resource "google_sql_database_instance" "instance" {
  name             = "app-postgres"
  database_version = "POSTGRES_12"
  settings {
    tier = var.db_tier
  }
}

resource "google_sql_database" "database" {
  name     = "app-database"
  instance = google_sql_database_instance.instance.name
}

resource "random_password" "app_database_password" {
  length           = 16
  special          = true
  override_special = "_%@"
}

resource "random_password" "cloud_build_database_password" {
  length           = 16
  special          = true
  override_special = "_%@"
}

resource "google_sql_user" "app_database_user" {
  name     = "app"
  instance = google_sql_database_instance.instance.name
  password = random_password.app_database_password.result
}

resource "google_sql_user" "cloud_build_database_user" {
  name     = "cloud-build"
  instance = google_sql_database_instance.instance.name
  password = random_password.cloud_build_database_password.result
}

# Redis

resource "google_redis_instance" "queue" {
  name           = "memory-queue"
  memory_size_gb = var.memory_size_gb
}

# Cloud Secret Manager

resource "google_secret_manager_secret" "github_client_secret" {
  secret_id = "github-client-secret"

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}

data "google_secret_manager_secret_version" "github_client_secret" {
  secret = google_secret_manager_secret.github_client_secret.secret_id
}

data "google_compute_default_service_account" "default" {
}

resource "google_secret_manager_secret_iam_member" "compute_default_service_account" {
  secret_id = google_secret_manager_secret.github_client_secret.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${data.google_compute_default_service_account.default.email}"
}

data "google_project" "project" {
}

locals {
  google_cloud_build_service_account = "${data.google_project.project.number}@cloudbuild.gserviceaccount.com"
}

resource "google_secret_manager_secret_iam_member" "build_default_service_account" {
  secret_id = google_secret_manager_secret.github_client_secret.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${local.google_cloud_build_service_account}"
}

# Cloud Run

variable "image_id" {
  type = string
}

resource "random_password" "jwt_secret" {
  length           = 16
  special          = true
  override_special = "_%@"
}

resource "google_cloud_run_service" "default" {
  name     = "cloudrun-srv"
  location = var.region

  template {
    spec {
      containers {
        image = var.image_id
        env {
          name  = "NODE_ENV"
          value = "production"
        }
        env {
          name  = "POSTGRESQL_URL"
          value = "postgresql://${google_sql_user.app_database_user.name}:${google_sql_user.app_database_user.password}@127.0.0.1/${google_sql_database.database.name}?host=/cloudsql/${var.project}:${var.region}:${google_sql_database_instance.instance.name}"
        }
        env {
          name  = "REDIS_URL"
          value = google_redis_instance.queue.host
        }
        env {
          name  = "BCRYPT_SALT_OR_ROUNDS"
          value = var.bcrypt_salt_or_rounds
        }
        env {
          name  = "JWT_SECRET"
          value = random_password.jwt_secret.result
        }
        env {
          name  = "GITHUB_SECRET_SECRET_NAME"
          value = data.google_secret_manager_secret_version.github_client_secret.name
        }
        env {
          name  = "AMPLITUDE_API_KEY"
          value = local.amplitude_api_key
        }
        env {
          name  = "GITHUB_CLIENT_ID"
          value = local.github_client_id
        }
        env {
          name  = "GITHUB_SCOPE"
          value = local.github_scope
        }
        env {
          name  = "GITHUB_REDIRECT_URI"
          value = local.github_redirect_uri
        }
        env {
          name  = "REACT_APP_AMPLITUDE_API_KEY"
          value = local.amplitude_api_key
        }
        env {
          name  = "REACT_APP_GITHUB_CLIENT_ID"
          value = local.github_client_id
        }
      }
    }

    metadata {
      annotations = {
        "run.googleapis.com/cloudsql-instances"   = "${var.project}:${var.region}:${google_sql_database_instance.instance.name}"
        "run.googleapis.com/client-name"          = "terraform"
        "run.googleapis.com/vpc-access-connector" = google_vpc_access_connector.connector.name
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
  autogenerate_revision_name = true

  depends_on = [
    google_secret_manager_secret_iam_member.compute_default_service_account
  ]
}


data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location = google_cloud_run_service.default.location
  project  = google_cloud_run_service.default.project
  service  = google_cloud_run_service.default.name

  policy_data = data.google_iam_policy.noauth.policy_data
}

# VPC

resource "google_vpc_access_connector" "connector" {
  name          = "app-vpc-connector"
  region        = var.region
  ip_cidr_range = "10.8.0.0/28"
  network       = "default"
}

resource "google_cloudbuild_trigger" "master" {
  provider    = google-beta
  name        = "master"
  description = "Push to master"
  github {
    owner = "amplication"
    name  = "amplication"
    push {
      branch = "^master$"
    }
  }
  substitutions = {
    _POSTGRESQL_USER     = google_sql_user.cloud_build_database_user.name
    _POSTGRESQL_PASSWORD = google_sql_user.cloud_build_database_user.password
    _POSTGRESQL_DB       = google_sql_database.database.name
    _DB_INSTANCE         = google_sql_database_instance.instance.name
    _IMAGE_REPOSITORY    = var.image_repository
    _REGION              = var.region
  }
  filename = var.google_cloudbuild_trigger_filename
  tags = [
    "github-default-push-trigger"
  ]
}
