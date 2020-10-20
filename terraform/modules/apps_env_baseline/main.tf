# Provider

provider "google" {
  project = var.project
  region  = var.region
}

# APIs

resource "google_project_service" "cloud_resource_manager_api" {
  service = "cloudresourcemanager.googleapis.com"
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

resource "google_project_service" "cloud_build_api" {
  service    = "cloudbuild.googleapis.com"
  depends_on = [google_project_service.cloud_resource_manager_api]
}

resource "google_project_service" "cloud_run_admin_api" {
  service    = "run.googleapis.com"
  depends_on = [google_project_service.cloud_resource_manager_api]
}

resource "google_project_service" "cloud_dns_api" {
  service    = "dns.googleapis.com"
  depends_on = [google_project_service.cloud_resource_manager_api]
}

# Storage

resource "google_storage_bucket" "terraform_state" {
  name          = var.bucket
  location      = var.bucket_location
  force_destroy = true
}

# Google SQL

resource "google_sql_database_instance" "instance" {
  name             = "apps-database-instance"
  database_version = "POSTGRES_12"
  settings {
    tier = var.database_tier
  }
}

# Google DNS

resource "google_dns_managed_zone" "zone" {
  name       = "apps-domain-zone"
  dns_name   = "${var.domain}."
  depends_on = [google_project_service.cloud_dns_api]
}


# IAM

module "default_cloud_build_service_account" {
  source  = "../../modules/cloud_build_default_service_account"
  project = var.project
}

resource "google_project_iam_member" "cloud_build" {
  role       = "roles/editor"
  member     = "serviceAccount:${module.default_cloud_build_service_account.email}"
  depends_on = [google_project_service.cloud_build_api]
}

data "google_compute_default_service_account" "platform" {
  project = var.platform_project
}

resource "google_project_iam_member" "cloud_run" {
  role       = "roles/editor"
  member     = "serviceAccount:${data.google_compute_default_service_account.platform.email}"
  depends_on = [google_project_service.cloud_run_admin_api]
}

module "platform_cloud_build_service_account" {
  source  = "../../modules/cloud_build_default_service_account"
  project = var.platform_project
}

resource "google_project_iam_member" "platform_cloud_build" {
  role   = "roles/editor"
  member = "serviceAccount:${module.platform_cloud_build_service_account.email}"
}

# Output

output "terraform_state_bucket" {
  value = google_storage_bucket.terraform_state.name
}

output "database_instance" {
  value = google_sql_database_instance.instance.name
}

output "zone" {
  value = google_dns_managed_zone.zone.name
}
