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
db_tier = "db-g1-small"

# Cloud Run
bcrypt_salt_or_rounds = 10
host = "https://app.amplication.com"

# Secret Manager
github_client_secret_id = "github_client_secret"

# UI
feature_flags = {}

# Storage
default_disk = "gcs"
bucket = "amplication-production-artifacts"

# Cloud Build
image = "gcr.io/amplication/amplication"
google_cloudbuild_trigger_filename = "production.cloudbuild.yaml"
google_cloudbuild_trigger_name = "version-manual-deploy"
github_owner = "amplication"
github_name = "amplication"
github_tag = "v.+"

# Apps Cloud Build
gcp_apps_project_id = "amplication-production"
container_builder_default = "cloud-build"