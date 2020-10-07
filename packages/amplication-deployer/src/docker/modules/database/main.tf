provider "docker" {
}

resource "random_password" "password" {
  length           = 16
  special          = true
  override_special = "_%@"
}

locals {
  user = "app"
}


resource "docker_container" "database" {
  name  = "${var.app_id}-database"
  image = "postgres:12"
  env = [
    "POSTGRES_USER=${local.user}",
    "POSTGRES_PASSWORD=${random_password.password.result}"
  ]
}

output "password" {
  value = random_password.password.result
}

output "user" {
  value = local.user
}
