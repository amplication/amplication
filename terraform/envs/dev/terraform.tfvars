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

# paddle - sandbox
paddle_vendor_id = "2673"

# GitHub - App
github_app_client_id = "Iv1.e0d76b0ce191a528"
github_app_app_id = "174833"
github_app_installation_url = "https://github.com/apps/amplication-staging/installations/new?state={state}"

# Segment
amplitude_api_key = "aVqxCAcXOdCx5DPI41s6EmwsSCB8Kjz6"

# Sendgrid
sendgrid_from_address = "team@amplication.com"
sendgrid_invitation_template_id = "d-aaae46e4127c4d2399d242610e6c496a"
paddle_base_64_public_key = "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQ0lqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FnOEFNSUlDQ2dLQ0FnRUFvUmh5d1dnK3h2UmhKN2lFMDJlaQpJMGVNL1lqVnFpTHpFbEwzYUR2MTQ5cUxYZk9FeUR0NzV0emk4RlpraHh5TjJOV0R0REpKdGJETmlKVklISmVlCnR5cWl5WUF6VCtZOUM5SlpQdE9DOTBwaVg0YmxIRG1KQVltZGs2b1VjTU5BbjNwaW5rWWFnVW5mV3piS0p3NnkKdmdYR2JUS2VKejVNcEVrRUY0UXQwM2JOVlk2VHZBZVNqS0d1bEhsbHZqMnRlTFp0Ui9IbjRtYmhVdUZwenh1VAo3LzgwZEVVUWx5Mk9hMSsxSUZ0OVhBTTBvdjhUWUFQMnpjV0dlWWs3K2RIRndKMThlVkp5cGUyMkxSbEVONXdrClNkUXJvcmVBV1FjUjcvKzZBRGJyR1VNVU1BM3p1SVg5U292UkMwOWdEdUR6TGxncC9ieitWRVlaa0Z4dmRneHAKKzZVY0VsNnhPUXJoMW0wVW9BWlEreTRQb0svazY1bHBHeUhnWW92WHlQRzdoTWJRNmhQQjl3Wmx4TjNFeHBkUQpLWTg2T3gwajlWSVB6bTZxVDNZenJmZ0FhTXpSRDRxOHhUQURPVTEvY1hEOVFPY2grYmkrcHR2eFAvY1ZhWWZBCkcvdjF4Wkxzem9rTWFYUFJCa2NuUWRMdVY1TzREUDIreFBScitPYXZtWVBOVUIvRHNGZGRraFlJMFNQQ2d2cmUKRERCWXJWYTRCZ0FMR294TTJGYkJoZ3dWN2FRNEFXYXFLTVdWUy9nT1pYRUgxZlV6aGVqay9yeGh0NXN2eFBIUApsRWpsdEFvRzY2bEsyandsYjRab09INnl6Yjg0b0pVeDRjZE4vQmJEMWpDaERaZEJoN0M0YVFCaUFKRmtkc0lRCjdMWmVJOVJmRFlKVms5SnRzWTNzZjlrQ0F3RUFBUT09Ci0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQ=="

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
segment_write_key_secret_id = "segment_write_key_secret"
sendgrid_api_key_secret_id = "sendgrid_api_key_secret"

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