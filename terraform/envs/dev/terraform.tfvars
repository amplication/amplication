# Google
project = "amplication"
region = "us-east1"
app_engine_region = "us-east4"

# GitHub
github_client_id    = "2e4a744d73ea633fd615"
github_scope        = "user:email"
github_redirect_uri = "https://staging.amplication.com/github/callback"

github_app_auth_scope       = "user:email,repo,read:org"
github_app_auth_redirect_uri = "https://staging.amplication.com/github-auth-app/callback/{appId}"

# GitHub - App
github_app_client_id = "Iv1.e0d76b0ce191a528"
github_app_app_id = "174833"
github_app_installation_url = "https://github.com/apps/amplication-staging/installations/new?state={state}"

# Segment
amplitude_api_key = "aVqxCAcXOdCx5DPI41s6EmwsSCB8Kjz6"

# Cloud SQL
database_tier = "db-f1-micro"

# Cloud Run
bcrypt_salt_or_rounds = "10"
host = "https://staging.amplication.com"
server_database_connection_limit = 2
server_min_scale = 0
server_max_scale = 2

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