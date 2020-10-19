# Google
project = "amplication"
region = "us-east1"

# GitHub
github_client_id    = "2e4a744d73ea633fd615"
github_scope        = "user:email"
github_redirect_uri = "https://staging.amplication.com/github/callback"

# Amplitude
amplitude_api_key = "39a7316e0f18df8be74bac74cfa708be"

# Cloud SQL
database_tier = "db-f1-micro"

# Cloud Run
bcrypt_salt_or_rounds = "10"
host = "https://staging.amplication.com"
server_database_connection_limit = 2
server_max_scale = 2

# Cloud Build
image_repository = "amplication"
app_base_image_repository = "app-node"
google_cloudbuild_trigger_filename = "cloudbuild.yaml"
github_owner = "amplication"
github_name = "amplication"
github_branch = "master"

# Secret Manager
github_client_secret_id = "github_client_secret"

# UI
feature_flags = {
    "SHOW_DEPLOYER": true
}

# Storage
bucket = "amplication-artifacts"
bucket_location = "US"
default_disk = "gcs"

# Container Builder
apps_project = "amplication-apps"
container_builder_default = "cloud-build"

# Deployer
deployer_default = "gcp"
apps_region = "us-east1"
apps_terraform_state_bucket = "amplication-apps-state-bucket"
apps_domain = "staging.amplication.app"