provider "google" {
  project = var.project
  region  = var.region
}

locals {
  bcrypt_salt = "10"
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
          name  = "GRAPHQL_PLAYGROUND"
          value = "true"
        }
        env {
          name  = "POSTGRESQL_URL"
          value = "postgresql://${var.database_user}:${var.database_password}@127.0.0.1/${var.database_name}?host=/cloudsql/${var.project}:${var.region}:${var.database_instance}"
        }
        env {
          name  = "BCRYPT_SALT"
          value = local.bcrypt_salt
        }
      }
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale" : 1
        "run.googleapis.com/cloudsql-instances" = "${var.project}:${var.region}:${var.database_instance}"
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

# resource "google_cloud_run_domain_mapping" "default" {
#   location = var.region
#   name     = var.domain

#   metadata {
#     namespace = var.project
#     annotations = {
#       "run.googleapis.com/launch-stage" = "BETA"
#     }
#   }

#   spec {
#     route_name = google_cloud_run_service.default.name
#   }
# }

output "url" {
  value = google_cloud_run_service.default.status[0].url
}

output "bcrypt_salt" {
  value = local.bcrypt_salt
}
