# Google

variable "project" {
  type = string
}

variable "region" {
  type = string
}

# Cloud Build

variable "database_name" {
  type = string
}

variable "database_instance" {
  type = string
}

variable "image" {
  type = string
}

variable "google_cloudbuild_trigger_filename" {
  type = string
}

variable "google_cloudbuild_trigger_name" {
  type = string
}

variable "github_owner" {
  type = string
}

variable "github_name" {
  type = string
}

variable "github_tag" {
  type = string
}

# Secret Manager

variable "github_client_secret_id" {
  type = string
}
