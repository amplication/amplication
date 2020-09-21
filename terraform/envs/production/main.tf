module "env" {
  source                  = "../../modules/env_baseline"
  project                 = var.project
  region                  = var.region
  github_client_id        = var.github_client_id
  github_scope            = var.github_scope
  github_redirect_uri     = var.github_redirect_uri
  amplitude_api_key       = var.amplitude_api_key
  db_tier                 = var.db_tier
  image_id                = var.image_id
  bcrypt_salt_or_rounds   = var.bcrypt_salt_or_rounds
  github_client_secret_id = var.github_client_secret_id
  show_ui_elements        = var.show_ui_elements
  default_disk            = var.default_disk
  host                    = var.host
}

module "deploy" {
  source                             = "../../modules/manual_deploy"
  project                            = var.project
  region                             = var.region
  db_name                            = module.env.db_name
  db_instance                        = module.env.db_instance
  image_id                           = var.image_id
  google_cloudbuild_trigger_filename = var.google_cloudbuild_trigger_filename
  github_client_secret_id            = var.github_client_secret_id
}
