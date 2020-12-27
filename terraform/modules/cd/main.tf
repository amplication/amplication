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

resource "google_project_service" "cloud_sql" {
  service    = "sql-component.googleapis.com"
  depends_on = [google_project_service.cloud_resource_manager_api]
}

resource "google_project_service" "cloud_build_api" {
  service    = "cloudbuild.googleapis.com"
  depends_on = [google_project_service.cloud_resource_manager_api]
}

resource "google_project_service" "iam_api" {
  service    = "iam.googleapis.com"
  depends_on = [google_project_service.cloud_resource_manager_api]
}

resource "google_project_service" "secret_manager_api" {
  service    = "secretmanager.googleapis.com"
  depends_on = [google_project_service.cloud_resource_manager_api]
}

# IAM

resource "google_project_service_identity" "cloud_build" {
  provider = google-beta
  project  = var.project
  service  = "cloudbuild.googleapis.com"
}

resource "google_project_iam_binding" "cloud_build_editor" {
  role    = "roles/editor"
  members = ["serviceAccount:${google_project_service_identity.cloud_build.email}"]
}

# Cloud SQL

resource "random_password" "database_password" {
  length           = 16
  special          = true
  override_special = "_%@"
}

resource "google_sql_user" "database_user" {
  name     = "cloud-build"
  instance = var.database_instance
  password = random_password.database_password.result
}

# Secret Manager

resource "google_secret_manager_secret_iam_member" "secret_iam_member" {
  secret_id  = var.github_client_secret_id
  role       = "roles/secretmanager.secretAccessor"
  member     = "serviceAccount:${google_project_service_identity.cloud_build.email}"
  depends_on = [google_project_service.secret_manager_api]
}

# Cloud Build

locals {
  image          = "gcr.io/${var.project}/${var.image_repository}"
  app_base_image = "gcr.io/${var.project}/${var.app_base_image_repository}"
}

resource "google_cloudbuild_trigger" "trigger" {
  provider    = google-beta
  name        = var.github_branch
  description = "Push to ${var.github_branch}"
  github {
    owner = var.github_owner
    name  = var.github_name
    push {
      branch = "^${var.github_branch}$"
    }
  }
  substitutions = {
    _REGION              = var.region
    _DB_INSTANCE         = var.database_instance
    _POSTGRESQL_DB       = var.database_name
    _POSTGRESQL_USER     = google_sql_user.database_user.name
    _POSTGRESQL_PASSWORD = random_password.database_password.result
    _IMAGE               = local.image
    _APP_BASE_IMAGE      = local.app_base_image
  }
  filename = var.google_cloudbuild_trigger_filename
  tags = [
    "github-default-push-trigger"
  ]
}

output "image" {
  value = local.image
}

output "app_base_image" {
  value = local.app_base_image
}
