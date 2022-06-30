# Google

variable "project" {
  type = string
}

variable "region" {
  type = string
}

variable "app_engine_region" {
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

variable "github_app_auth_scope" {
  type = string
}

variable "github_app_auth_redirect_uri" {
  type = string
}

# paddle
variable "paddle_vendor_id" {
  type = string
}

variable "github_app_private_key" {
  type = string
}

variable "github_app_client_secret" {
  type = string
}

variable "github_app_client_id" {
  type = string
}

variable "github_app_app_id" {
  type = string
}
variable "github_app_installation_url" {
  type = string
}
# Amplitude

variable "amplitude_api_key" {
  type = string
}

# Sendgrid
variable "sendgrid_from_address" {
  type = string
}

# paddle
variable "paddle_base_64_public_key" {
  type = string
}

variable "sendgrid_invitation_template_id" {
  type = string
}

# Cloud SQL
variable "database_tier" {
  type = string
}

# Cloud Run

variable "image_id" {
  type = string
}

variable "bcrypt_salt_or_rounds" {
  type = string
}

variable "feature_flags" {
  type = map(any)
}

variable "host" {
  type = string
}

variable "server_database_connection_limit" {
  type = number
}

variable "server_min_scale" {
  type = number
}

variable "server_max_scale" {
  type = number
}

# Secret Manager

variable "github_client_secret_id" {
  type = string
}
variable "segment_write_key_secret_id" {
  type = string
}

variable "sendgrid_api_key_secret_id" {
  type = string
}

# Storage

variable "default_disk" {
  type = string
}

variable "bucket" {
  type = string
}

variable "bucket_location" {
  type = string
}

# Container Builder

variable "apps_project" {
  type = string
}

variable "container_builder_default" {
  type = string
}

# Deployer

variable "deployer_default" {
  type = string
}

variable "apps_region" {
  type = string
}

variable "apps_terraform_state_bucket" {
  type = string
}

variable "apps_domain" {
  type = string
}

# Webhooks & kafka 

 variable "kafka_broker_ip" {
  type = string
}
variable "webhooks_secret_key" {
  type = string
}
variable "kafka_repository_push_queue" {
  type = string
}
