# Google

variable "project" {
  type = string
}

variable "region" {
  type = string
}

# Cloud Build

variable "db_name" {
  type = string
}

variable "db_instance" {
  type = string
}

variable "image" {
  type = string
}

variable "google_cloudbuild_trigger_filename" {
  type = string
}

variable "github_tag" {
  type = string
}

# Secret Manager

variable "github_client_secret_id" {
  type = string
}
