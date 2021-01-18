# Google
project = "amplication-production"
region = "us-east1"

# GitHub
github_client_id    = "cc622ae6020e92fa1442"
github_scope        = "user:email"
github_redirect_uri = "https://app.amplication.com/github/callback"

github_app_auth_scope       = "user:email,repo,read:org"
github_app_auth_redirect_uri = "https://app.amplication.com/github-auth-app/callback/{appId}"

# Amplitude
amplitude_api_key = "d6c2950cd60b91196e678f9a3a7ac705"

# Cloud SQL
database_tier = "db-custom-4-8192"

# Cloud Run
bcrypt_salt_or_rounds = 10
host = "https://app.amplication.com"
server_database_connection_limit = 40
server_min_scale = 2
server_max_scale = 9

# Secret Manager
github_client_secret_id = "github_client_secret"

# UI
feature_flags = {
    "SHOW_DEPLOYER": true
}

# Storage
default_disk = "gcs"
bucket = "amplication-production-artifacts"
bucket_location = "US"

# Cloud Build
image = "gcr.io/amplication/amplication"
app_base_image = "gcr.io/amplication/app-node"
google_cloudbuild_trigger_filename = "production.cloudbuild.yaml"
google_cloudbuild_trigger_name = "version-manual-deploy"
github_owner = "amplication"
github_name = "amplication"
github_tag = "v.+"

# Apps Cloud Build
apps_project = "amplication-production-apps"
apps_project_2 = "amplication-production-apps-2"
container_builder_default = "cloud-build"

# Deployer
deployer_default = "gcp"
apps_region = "us-east1"
apps_terraform_state_bucket = "amplication-production-apps-state-bucket"
apps_terraform_state_bucket_2 = "amplication-production-apps-state-bucket_2"
apps_domain = "amplication.app"