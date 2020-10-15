provider "google" {
  project = var.project
  region  = var.region
}

resource "google_project_service" "cloud_resource_manager_api" {
  service = "cloudresourcemanager.googleapis.com"
}

resource "google_project_service" "cloud_dns_api" {
  service    = "dns.googleapis.com"
  depends_on = [google_project_service.cloud_resource_manager_api]
}

resource "google_dns_managed_zone" "zone" {
  name       = var.name
  dns_name   = var.dns_name
  depends_on = [google_project_service.cloud_dns_api]
}
