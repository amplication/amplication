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

resource "docker_container" "server" {
  name  = "${var.app_id}-server"
  image = var.image_id
  env = [
    "NODE_ENV=production",
    "POSTGRESQL_URL=postgresql://${var.database_user}:${var.database_password}@${var.database_host}"
  ]
}
