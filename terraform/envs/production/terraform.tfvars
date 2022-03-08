# Google
project = "amplication-production"
region = "us-east1"

# GitHub
github_client_id    = "cc622ae6020e92fa1442"
github_scope        = "user:email"
github_redirect_uri = "https://app.amplication.com/github/callback"

github_app_auth_scope       = "user:email,repo,read:org"
github_app_auth_redirect_uri = "https://app.amplication.com/github-auth-app/callback/{appId}"

# paddle - prod
paddle_vendor_id = "131992"

# Amplitude (segment write key)
amplitude_api_key = "P5sO0VHJJlCrBz9bPYhFgN94VwyTyxPO"

# Sendgrid
sendgrid_from_address = "team@amplication.com"
sendgrid_invitation_template_id = "d-aaae46e4127c4d2399d242610e6c496a"
paddle_base_64_public_key = "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQ0lqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FnOEFNSUlDQ2dLQ0FnRUF1YXVpYVNuMGE2TUppZWcwV0ZiNAo1Y004SjhlS1hUZjdGdFo0VW83YnE5a3Jab1VaY2xQY0RvK0V6MTl6NjZ0d0s1eXpDdnRpUzRiZXB6UjVlSkZqCllNaUZlYUJXS3JFTm50Q3JMNTltM2FtRGVXTDhIeE1JQkRxK3VHbTYxdEwwTnNyUVF6eis2SXRwcHYvQUpmQUcKZW01M2U4SGUvS1A1TVloUGtFUXJQS3lPbXhBUHVzdjY5cHo4VXBxRm9mZE9QOTNON2tBWjNyZ2lvUmhzUmp6ZQp4dE1BM0g3UXhyVEQxdFBjRWRvQ0JkNWhtRXJ3dTk4L1Y4U2hmalFKWlIvNUxDakMxdDNGYzVVQ3pHdmdlbjRwCjM4TnlvbGd3TVM1MWN5dE1mcEtqYWhWNlFOc3ZPSzliQ0VLZFB0azZHbkV1bWoyak9rRi9YY1dGZGpyZmRseFMKMXBWU1lUMTNPUlZTQUx2MXB6MkFjdFRlVmFkd1V3V3gva0dBaXpndm80di9aT1UxRWRqc213czRkRnhhSmJKRQpMT3FEbUpDblFQUkZPS0FSejhZU0N0UWU0Z282VVJhSmZZdi9vWXFISEpJUkFvRkdIbys4ZWhJSkZzazFwOXVpCi83OXA0aWE1LzhieEl2MHlCV1Q4S0pZekVzbmFzRzNKaEhyOVJHUk4wN25QT2swek90Q0d6UzNBUW9POG81cFEKRS9vako5eml4MlI1aExWWWhDR2hHNXFNd2k3MGlEYTRnNXl0Q1M0T2tJdmt6YVN0L3locTdoTDRDb3JUOVVpUApFSVdnQWhFUEpsZEVVU0hMRkFjRWc1SVAyajN4b3pjRWN5RjlsRHBVNGx3MkZ2U2NGOXUyWTN2TFNjd3REejVICmNUVUQ3S05jZWNnUmFRMW0xdFJBd1Y4Q0F3RUFBUT09Ci0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQ=="

# Github-App
github_app_client_id = "Iv1.3f1573355389c9e5"
github_app_app_id = "176701"
github_app_installation_url = "https://github.com/apps/amplication/installations/new?state={state}"


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
segment_write_key_secret_id = "segment_write_key_secret"
sendgrid_api_key_secret_id = "sendgrid_api_key_secret"

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