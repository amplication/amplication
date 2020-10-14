module "apps_env" {
  source          = "../modules/apps_env_baseline"
  project         = var.gcp_apps_project_id
  region          = var.gcp_apps_region
  db_tier         = var.db_tier
  bucket_location = var.bucket_location
}

module "env" {
  source                            = "../../modules/env_baseline"
  project                           = var.project
  region                            = var.region
  github_client_id                  = var.github_client_id
  github_scope                      = var.github_scope
  github_redirect_uri               = var.github_redirect_uri
  amplitude_api_key                 = var.amplitude_api_key
  db_tier                           = var.db_tier
  image_id                          = var.image_id
  generated_app_base_image_id       = var.generated_app_base_image_id
  bcrypt_salt_or_rounds             = var.bcrypt_salt_or_rounds
  github_client_secret_id           = var.github_client_secret_id
  feature_flags                     = var.feature_flags
  default_disk                      = var.default_disk
  host                              = var.host
  server_db_connection_limit        = var.server_db_connection_limit
  server_max_scale                  = var.server_max_scale
  bucket                            = var.bucket
  bucket_location                   = var.bucket_location
  gcp_apps_project_id               = var.gcp_apps_project_id
  container_builder_default         = var.container_builder_default
  deployer_default                  = var.deployer_default
  gcp_apps_region                   = var.gcp_apps_region
  gcp_deploy_terraform_state_bucket = module.apps_env.terraform_state_bucket
  gcp_apps_database_instance        = module.apps_env.database_instance
  gcp_apps_domain                   = var.gcp_apps_domain
}

module "deploy" {
  source                             = "../../modules/manual_deploy"
  project                            = var.project
  region                             = var.region
  db_name                            = module.env.db_name
  db_instance                        = module.env.db_instance
  github_client_secret_id            = var.github_client_secret_id
  image                              = var.image
  google_cloudbuild_trigger_filename = var.google_cloudbuild_trigger_filename
  google_cloudbuild_trigger_name     = var.google_cloudbuild_trigger_name
  github_owner                       = var.github_owner
  github_name                        = var.github_name
  github_tag                         = var.github_tag
}
