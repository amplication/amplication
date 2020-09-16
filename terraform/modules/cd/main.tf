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

# Cloud SQL

resource "random_password" "database_password" {
  length           = 16
  special          = true
  override_special = "_%@"
}

resource "google_sql_user" "database_user" {
  name     = "cloud-build"
  instance = var.db_instance
  password = random_password.database_password.result
}

resource "google_project_service" "secret_manager_api" {
  service    = "secretmanager.googleapis.com"
  depends_on = [google_project_service.cloud_resource_manager_api]
}

# Secret Manager


data "google_project" "project" {
}

locals {
  service_account = "${data.google_project.project.number}@cloudbuild.gserviceaccount.com"
}

resource "google_secret_manager_secret_iam_member" "secret_iam_member" {
  secret_id = var.github_client_secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${local.service_account}"
}

# Cloud Build

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
    _POSTGRESQL_USER     = google_sql_user.database_user.name
    _POSTGRESQL_PASSWORD = random_password.database_password.result
    _POSTGRESQL_DB       = var.db_name
    _DB_INSTANCE         = var.db_instance
    _IMAGE_REPOSITORY    = var.image_repository
    _REGION              = var.region
  }
  filename = var.google_cloudbuild_trigger_filename
  tags = [
    "github-default-push-trigger"
  ]
}
