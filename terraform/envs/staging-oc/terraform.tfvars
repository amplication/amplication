# Google
project = "amplication-staging-oc"
region = "us-east1"
app_engine_region = "us-east1"

# GitHub
github_client_id    = "c53d9f4819a1ebc92e25"
github_scope        = "user:email"
github_redirect_uri = "https://staging-oc.amplication.com/github/callback"

github_app_auth_scope       = "user:email,repo,read:org"
github_app_auth_redirect_uri = "https://staging-oc.amplication.com/github-auth-app/callback/{appId}"

# paddle - sandbox
paddle_vendor_id = "2673"

# Amplitude
amplitude_api_key = "39a7316e0f18df8be74bac74cfa708be"

# Sendgrid
sendgrid_from_address = "team@amplication.com"
sendgrid_invitation_template_id = "d-aaae46e4127c4d2399d242610e6c496a"

# Cloud SQL
database_tier = "db-f1-micro"

# Cloud Run
bcrypt_salt_or_rounds = "10"
host = "https://staging-oc.amplication.com"
server_database_connection_limit = 2
server_min_scale = 0
server_max_scale = 2

# Secret Manager
github_client_secret_id = "github_client_secret"
segment_write_key_secret_id = "segment_write_key_secret"
sendgrid_api_key_secret_id = "sendgrid_api_key_secret"

# UI
feature_flags = {
    "SHOW_DEPLOYER": true
}

# Storage
bucket = "amplication-staging-oc-artifacts"
bucket_location = "US"
default_disk = "gcs"

# Container Builder
apps_project = "amplication-staging-oc-apps"
container_builder_default = "cloud-build"

# Deployer
deployer_default = "gcp"
apps_region = "us-east1"
apps_terraform_state_bucket = "amplication-staging-oc-apps-state-bucket"
apps_domain = "staging-oc.amplication.app"