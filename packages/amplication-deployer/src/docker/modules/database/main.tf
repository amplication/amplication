terraform {
  required_providers {
    docker = {
      source = "terraform-providers/docker"
    }
  }
}

provider "docker" {
  host = var.docker_host
}

resource "random_password" "password" {
  length           = 16
  special          = true
  override_special = "_%@"
}

locals {
  name = "${var.app_id}-database"
  user = "app"
}

resource "docker_container" "database" {
  name  = local.name
  image = "postgres:12"
  env = [
    "POSTGRES_USER=${local.user}",
    "POSTGRES_PASSWORD=${random_password.password.result}"
  ]
}

output "host" {
  value = local.name
}

output "user" {
  value = local.user
}

output "password" {
  value = random_password.password.result
}
