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
          value = "postgresql://${var.database_user}:${var.database_password}@127.0.0.1/${var.database_name}?host=/cloudsql/${var.project}:${var.region}:${var.database_instance}"
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

module "cloud_build_build" {
  source = "../cloud-build-build"
  configuration = {
    steps : [
      {
        name : "gcr.io/cloud-builders/docker"
        args : ["pull", "gcr.io/cloudsql-docker/gce-proxy:1.11"]
      },
      {
        name : "gcr.io/cloud-builders/docker"
        args : [
          "run",
          "-d",
          "--network=cloudbuild",
          "-v",
          "/cloudsql:/cloudsql",
          "gcr.io/cloudsql-docker/gce-proxy:1.11",
          "/cloud_sql_proxy",
          "-dir=/cloudsql",
          "-instances=$PROJECT_ID:$_REGION:$_DB_INSTANCE",
        ]
      },
      {
        name : "gcr.io/cloud-builders/docker",
        args : [
          "run",
          "--network=cloudbuild",
          "-v",
          "/cloudsql:/cloudsql",
          "--env",
          "POSTGRESQL_URL=postgresql://$_POSTGRESQL_USER:$_POSTGRESQL_PASSWORD@127.0.0.1/$_POSTGRESQL_DB?host=/cloudsql/$PROJECT_ID:$_REGION:$_DB_INSTANCE",
          "$_IMAGE_ID",
          "bash",
          "-c",
          "npm run db:clean; npm run db:init",
        ]
      }
    ]
  }
  substitutions = [
    "_IMAGE_ID=${var.image_id}",
    "_REGION=${var.region}",
    "_DB_INSTANCE=${var.database_instance}",
    "_POSTGRESQL_USER=${var.database_user}",
    "_POSTGRESQL_PASSWORD=${var.database_password}",
    "_POSTGRESQL_DB=${var.database_name}"
  ]
}

resource "google_cloud_run_domain_mapping" "default" {
  location = var.region
  name     = var.domain

  metadata {
    namespace = var.project
    annotations = {
      "run.googleapis.com/launch-stage" = "BETA"
    }
  }

  spec {
    route_name = google_cloud_run_service.default.name
  }
}
