module "env" {
  source                = "../../modules/env_baseline"
  project               = var.project
  region                = var.region
  github_client_id      = var.github_client_id
  github_scope          = var.github_scope
  github_redirect_uri   = var.github_redirect_uri
  amplitude_api_key     = var.amplitude_api_key
  db_tier               = var.db_tier
  memory_size_gb        = var.memory_size_gb
  image_id              = var.image_id
  bcrypt_salt_or_rounds = var.bcrypt_salt_or_rounds
}
