# Provider

terraform {
  required_providers {
    postgresql = {
      source = "terraform-providers/postgresql"
    }
  }
}

provider "google" {
  project = "amplication"
  region  = "us-east1"
}

provider "google-beta" {
  project = "amplication"
  region  = "us-east1"
}

# Google SQL

resource "google_sql_database_instance" "instance" {
  name             = "app-postgres"
  database_version = "POSTGRES_12"
  settings {
    tier = "db-f1-micro"
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

resource "random_password" "cloud_build_database_password" {
  length           = 16
  special          = true
  override_special = "_%@"
}

resource "google_sql_user" "app_database_user" {
  name     = "app"
  instance = google_sql_database_instance.instance.name
  password = random_password.app_database_password.result
}

resource "google_sql_user" "cloud_build_database_user" {
  name     = "cloud-build"
  instance = google_sql_database_instance.instance.name
  password = random_password.cloud_build_database_password.result
}

# Redis

resource "google_redis_instance" "queue" {
  name           = "memory-queue"
  memory_size_gb = 1
}

# Cloud Secret Manager

resource "google_secret_manager_secret" "github_client_id" {
  secret_id = "github-client-id"

  labels = {
    label = "GitHub Client ID"
  }

  replication {
    user_managed {
      replicas {
        location = "us-east1"
      }
    }
  }
}

resource "google_secret_manager_secret" "github_client_secret" {
  secret_id = "github-client-secret"

  labels = {
    label = "GitHub Client Secret"
  }

  replication {
    user_managed {
      replicas {
        location = "us-east1"
      }
    }
  }
}

# Cloud Run

variable "image_id" {
  type = string
}

resource "random_password" "jwt_secret" {
  length           = 16
  special          = true
  override_special = "_%@"
}

resource "google_cloud_run_service" "default" {
  name     = "cloudrun-srv"
  location = "us-east1"

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
          value = "postgresql://${google_sql_user.app_database_user.name}:${google_sql_user.app_database_user.password}@127.0.0.1/${google_sql_database.database.name}?host=/cloudsql/amplication:us-east1:${google_sql_database_instance.instance.name}"
        }
        env {
          name  = "REDIS_URL"
          value = google_redis_instance.queue.host
        }
        env {
          name  = "BCRYPT_SALT_OR_ROUNDS"
          value = "10"
        }
        env {
          name  = "JWT_SECRET"
          value = random_password.jwt_secret.result
        }
        env {
          name = "GITHUB_CLIENT_ID_SECRET_NAME"
          value = google_secret_manager_secret.github_client_id.name
        }
        env {
          name = "GITHUB_SECRET_SECRET_NAME"
          value = google_secret_manager_secret.github_client_secret.name
        }
        env {
          name = "GITHUB_CALLBACK_URL",
          value = "/github/callback"
        }
      }
    }

    metadata {
      annotations = {
        "run.googleapis.com/cloudsql-instances"   = "amplication:us-east1:${google_sql_database_instance.instance.name}"
        "run.googleapis.com/client-name"          = "terraform"
        "run.googleapis.com/vpc-access-connector" = google_vpc_access_connector.connector.name
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

# VPC

resource "google_vpc_access_connector" "connector" {
  name          = "app-vpc-connector"
  region        = "us-east1"
  ip_cidr_range = "10.8.0.0/28"
  network       = "default"
}

# Cloud Build

resource "google_cloudbuild_trigger" "master" {
  provider    = google-beta
  name        = "master"
  description = "Push to master"
  github {
    owner = "amplication"
    name  = "amplication"
    push {
      branch = "^master$"
    }
  }
  substitutions = {
    _POSTGRESQL_USER     = google_sql_user.cloud_build_database_user.name
    _POSTGRESQL_PASSWORD = google_sql_user.cloud_build_database_user.password
  }
  filename = "cloudbuild.yaml"
  tags = [
    "github-default-push-trigger"
  ]
}
