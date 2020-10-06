provider "google" {
  project = var.project
  region  = var.region
}


resource "google_cloud_run_service" "default" {
  name     = "${var.app_id}-server"
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
          value = "postgresql://${var.database_username}:${var.database_password}@127.0.0.1/${var.database_name}?host=/cloudsql/${var.project}:${var.region}:${var.database_instance_name}"
        }
      }
    }

    metadata {
      annotations = {
        "run.googleapis.com/cloudsql-instances" = "${var.project}:${var.region}:${var.database_instance_name}"
        "run.googleapis.com/client-name"        = "terraform"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  autogenerate_revision_name = true
}
