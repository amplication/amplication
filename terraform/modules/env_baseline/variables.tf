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

variable "show_ui_elements" {
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

variable "bucket" {
  type = string
}

variable "default_disk" {
  type = string
}

# Container Builder

variable "apps_gcp_project_id" {
  type = string
}

variable "container_builder_default" {
  type = string
}
