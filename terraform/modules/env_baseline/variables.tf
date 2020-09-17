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

# Memorystore

variable "memory_size_gb" {
  type = number
}

# Cloud Run

variable "image_id" {
  type = string
}

variable "bcrypt_salt_or_rounds" {
  type = string
}

# Secret Manager

variable "github_client_secret_id" {
  type = string
}

variable "show_ui_elements" {
  type = string
}

# Storage

variable "default_disk" {
  type = string
}