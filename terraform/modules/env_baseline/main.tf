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

resource "google_project_service" "compute_engine_api" {
  service    = "compute.googleapis.com"
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

resource "google_project_service" "cloud_scheduler_api" {
  service    = "cloudscheduler.googleapis.com"
  depends_on = [google_project_service.cloud_resource_manager_api]
}

resource "google_project_service" "app_engine_admin_api" {
  service    = "appengine.googleapis.com"
  depends_on = [google_project_service.cloud_resource_manager_api]
}

# Google SQL

resource "google_sql_database_instance" "instance" {
  name             = "app-database-instance"
  database_version = "POSTGRES_12"
  settings {
    tier = var.database_tier
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

resource "google_sql_user" "app_database_user" {
  name     = "app"
  instance = google_sql_database_instance.instance.name
  password = random_password.app_database_password.result
}

# Cloud Secret Manager

data "google_compute_default_service_account" "default" {
}

data "google_secret_manager_secret_version" "github_client_secret" {
  secret = var.github_client_secret_id
}

resource "google_secret_manager_secret_iam_member" "compute_default_service_account" {
  secret_id = var.github_client_secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${data.google_compute_default_service_account.default.email}"
}

# Storage 

resource "google_storage_bucket" "artifacts" {
  name          = var.bucket
  location      = var.bucket_location
  force_destroy = true
  lifecycle_rule {
      action {
          type = "Delete"
      }
      condition {
        age = 30 
      }
  }

}

resource "google_project_service_identity" "apps_cloud_build" {
  provider = google-beta
  project  = var.apps_project
  service  = "cloudbuild.googleapis.com"
}

resource "google_storage_bucket_iam_member" "apps" {
  bucket = google_storage_bucket.artifacts.name
  role   = "roles/storage.objectViewer"
  member = "serviceAccount:${google_project_service_identity.apps_cloud_build.email}"
}

# Cloud Run

resource "random_password" "jwt_secret" {
  length           = 16
  special          = true
  override_special = "_%@"
}

resource "random_password" "service_jwt_secret" {
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
          name  = "ENABLE_CLOUD_TRACING"
          value = "1"
        }
        env {
          name  = "ENABLE_SHUTDOWN_HOOKS"
          value = "1"
        }
        env {
          name  = "POSTGRESQL_URL"
          value = "postgresql://${google_sql_user.app_database_user.name}:${google_sql_user.app_database_user.password}@127.0.0.1/${google_sql_database.database.name}?host=/cloudsql/${var.project}:${var.region}:${google_sql_database_instance.instance.name}&connection_limit=${var.server_database_connection_limit}"
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
          name  = "SERVICE_JWT_SECRET"
          value = random_password.service_jwt_secret.result
        }
        env {
          name  = "GITHUB_SECRET_SECRET_NAME"
          value = data.google_secret_manager_secret_version.github_client_secret.name
        }
        env {
          name  = "AMPLITUDE_API_KEY"
          value = var.amplitude_api_key
        }
        env {
          name  = "GITHUB_CLIENT_ID"
          value = var.github_client_id
        }
        env {
          name  = "GITHUB_SCOPE"
          value = var.github_scope
        }
        env {
          name  = "GITHUB_REDIRECT_URI"
          value = var.github_redirect_uri
        }
        env {
          name  = "GITHUB_APP_AUTH_SCOPE"
          value = var.github_app_auth_scope
        }
        env {
          name  = "GITHUB_APP_AUTH_REDIRECT_URI"
          value = var.github_app_auth_redirect_uri
        }
        env {
          name  = "DEFAULT_DISK"
          value = var.default_disk
        }
        env {
          name  = "GCS_BUCKET"
          value = google_storage_bucket.artifacts.name
        }
        env {
          name  = "GCP_APPS_PROJECT_ID"
          value = var.apps_project
        }
        env {
          name  = "CONTAINER_BUILDER_DEFAULT"
          value = var.container_builder_default
        }
        env {
          name  = "DEPLOYER_DEFAULT"
          value = var.deployer_default
        }
        env {
          name  = "GCP_APPS_REGION"
          value = var.apps_region
        }
        env {
          name  = "GCP_APPS_TERRAFORM_STATE_BUCKET"
          value = var.apps_terraform_state_bucket
        }
        env {
          name  = "GCP_APPS_DATABASE_INSTANCE"
          value = var.apps_database_instance
        }
        env {
          name  = "GCP_APPS_DOMAIN"
          value = var.apps_domain
        }
        env {
          name  = "REACT_APP_AMPLITUDE_API_KEY"
          value = var.amplitude_api_key
        }
        env {
          name  = "REACT_APP_GITHUB_CLIENT_ID"
          value = var.github_client_id
        }
        env {
          name  = "REACT_APP_FEATURE_FLAGS"
          value = jsonencode(var.feature_flags)
        }
        env {
          name  = "HOST"
          value = var.host
        }
        resources {
          limits = {
            cpu    = "4"
            memory = "2Gi"
          }
        }
      }
      container_concurrency = 8
      # 2 minutes
      timeout_seconds = 120
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale"      = var.server_min_scale
        "autoscaling.knative.dev/maxScale"      = var.server_max_scale
        "run.googleapis.com/cloudsql-instances" = "${var.project}:${var.region}:${google_sql_database_instance.instance.name}"
        "run.googleapis.com/client-name"        = "terraform"
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

resource "google_project_iam_member" "server_cloud_sql_client" {
  role   = "roles/cloudsql.client"
  member = "serviceAccount:${data.google_compute_default_service_account.default.email}"
}

resource "google_project_iam_member" "server_cloud_trace_agent" {
  role   = "roles/cloudtrace.agent"
  member = "serviceAccount:${data.google_compute_default_service_account.default.email}"
}

resource "google_project_iam_member" "server_cloud_storage" {
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${data.google_compute_default_service_account.default.email}"
}

# Scheduler

# Create app engine application for cloud scheduler to work
resource "google_app_engine_application" "app" {
  project     = var.project
  location_id = var.app_engine_region == "" ? var.region : var.app_engine_region
  count       = var.app_engine_region == "" ? 1 : 0
  depends_on  = [google_project_service.app_engine_admin_api]
}

resource "google_cloud_scheduler_job" "update-statuses" {
  name        = "server-update-statuses"
  description = "Call the server route for updating the statuses of actions"
  schedule    = "* * * * *"
  region      = var.app_engine_region

  http_target {
    http_method = "POST"
    uri         = "${var.host}/system/update-statuses"
  }

  depends_on = [google_project_service.cloud_scheduler_api, google_app_engine_application.app]
}

# Output

output "database_name" {
  value = google_sql_database.database.name
}

output "database_instance" {
  value = google_sql_database_instance.instance.name
}
