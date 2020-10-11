module "env" {
  source                      = "../../modules/env_baseline"
  project                     = var.project
  region                      = var.region
  github_client_id            = var.github_client_id
  github_scope                = var.github_scope
  github_redirect_uri         = var.github_redirect_uri
  amplitude_api_key           = var.amplitude_api_key
  db_tier                     = var.db_tier
  image_id                    = var.image_id
  generated_app_base_image_id = var.generated_app_base_image_id
  bcrypt_salt_or_rounds       = var.bcrypt_salt_or_rounds
  github_client_secret_id     = var.github_client_secret_id
  show_ui_elements            = var.show_ui_elements
  default_disk                = var.default_disk
  host                        = var.host
  bucket                      = var.bucket
  apps_gcp_project_id         = var.apps_gcp_project_id
  container_builder_default   = var.container_builder_default
}

module "cd" {
  source                             = "../../modules/cd"
  project                            = var.project
  region                             = var.region
  db_name                            = module.env.db_name
  db_instance                        = module.env.db_instance
  github_client_secret_id            = var.github_client_secret_id
  image_repository                   = var.image_repository
  app_base_image_repository          = var.app_base_image_repository
  google_cloudbuild_trigger_filename = var.google_cloudbuild_trigger_filename
  github_owner                       = var.github_owner
  github_name                        = var.github_name
  github_branch                      = var.github_branch
}
