provider "google" {
  project = var.project
  region  = var.region
}

resource "google_dns_managed_zone" "zone" {
  name     = var.name
  dns_name = var.dns_name
}
