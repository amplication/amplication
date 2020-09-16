# Google

variable "project" {
  type = string
}

variable "region" {
  type = string
}

# Cloud Build

variable "db_user" {
  type = string
}

variable "db_password" {
  type = string
}

variable "db_name" {
  type = string
}

variable "db_instance" {
  type = string
}

variable "image_repository" {
  type = string
}

variable "google_cloudbuild_trigger_filename" {
  type = string
}

variable "github_owner" {
  type = string
}

variable "github_name" {
  type = string
}

variable "github_branch" {
  type = string
}
