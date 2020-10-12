# Google

variable "project" {
  type = string
}

variable "region" {
  type = string
}

# GitHub

variable "github_client_id" {
  type = string
}

variable "github_scope" {
  type = string
}

variable "github_redirect_uri" {
  type = string
}

# Amplitude

variable "amplitude_api_key" {
  type = string
}

# Cloud SQL

variable "db_tier" {
  type = string
}

# Cloud Run

variable "image_id" {
  type = string
}

variable "generated_app_base_image_id" {
  type = string
}

variable "bcrypt_salt_or_rounds" {
  type = string
}

variable "feature_flags" {
  type = string
}

variable "host" {
  type = string
}

# Secret Manager

variable "github_client_secret_id" {
  type = string
}

# Storage

variable "default_disk" {
  type = string
}

variable "bucket" {
  type = string
}

# Cloud Build

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

# Container Builder

variable "apps_gcp_project_id" {
  type = string
}

variable "container_builder_default" {
  type = string
}
