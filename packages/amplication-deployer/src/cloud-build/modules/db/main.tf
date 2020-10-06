provider "google" {
  project = var.project
  region  = var.region
}

resource "google_sql_database" "database" {
  name     = "${var.app_id}_database"
  instance = var.instance_name
  tags     = [var.app_id]
}

resource "random_password" "app_database_password" {
  length           = 16
  special          = true
  override_special = "_%@"
}

resource "google_sql_user" "app_database_user" {
  name     = "${var.app_id}_database_user"
  instance = var.instance_name
  password = random_password.app_database_password.result
  tags     = [var.app_id]
}

output "name" {
  value = google_sql_database.database.name
}

output "password" {
  value = random_password.app_database_password
}

output "user" {
  value = google_sql_user.app_database_user.name
}
