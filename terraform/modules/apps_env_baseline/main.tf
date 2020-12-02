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

resource "google_dns_record_set" "cname" {
  name         = "*.${google_dns_managed_zone.zone.dns_name}"
  managed_zone = google_dns_managed_zone.zone.name
  type         = "CNAME"
  ttl          = 3600
  rrdatas      = ["ghs.googlehosted.com."]
}


# IAM

resource "google_project_service_identity" "cloud_build" {
  provider = google-beta
  project  = var.project
  service  = "cloudbuild.googleapis.com"
}

resource "google_project_iam_member" "cloud_build_editor" {
  role       = "roles/editor"
  member     = "serviceAccount:${google_project_service_identity.cloud_build.email}"
  depends_on = [google_project_service.cloud_build_api]
}

resource "google_project_iam_member" "cloud_build_run_admin" {
  role       = "roles/run.admin"
  member     = "serviceAccount:${google_project_service_identity.cloud_build.email}"
  depends_on = [google_project_service.cloud_build_api]
}

## Platform

data "google_compute_default_service_account" "platform" {
  project = var.platform_project
}

resource "google_project_iam_member" "cloud_run" {
  role       = "roles/editor"
  member     = "serviceAccount:${data.google_compute_default_service_account.platform.email}"
  depends_on = [google_project_service.cloud_run_admin_api]
}

resource "google_project_service_identity" "platform_cloud_build" {
  provider = google-beta
  project  = var.platform_project
  service  = "cloudbuild.googleapis.com"
}

resource "google_project_iam_member" "platform_cloud_build" {
  role   = "roles/editor"
  member = "serviceAccount:${google_project_service_identity.platform_cloud_build.email}"
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
