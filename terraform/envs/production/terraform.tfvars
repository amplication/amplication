# Google
project = "amplication-production"
region = "us-east1"

# GitHub
github_client_id    = "cc622ae6020e92fa1442"
github_scope        = "user:email"
github_redirect_uri = "https://app.amplication.com/github/callback"

# Amplitude
amplitude_api_key = "d6c2950cd60b91196e678f9a3a7ac705"

# Cloud SQL
database_tier = "db-g1-small"

# Cloud Run
bcrypt_salt_or_rounds = 10
host = "https://app.amplication.com"
server_database_connection_limit = 15
server_min_scale = 1
server_max_scale = 3

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
container_builder_default = "cloud-build"

# Deployer
deployer_default = "gcp"
apps_region = "us-east1"
apps_terraform_state_bucket = "amplication-production-apps-state-bucket"
apps_domain = "amplication.app"