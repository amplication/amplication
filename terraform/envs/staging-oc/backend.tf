terraform {
  backend "gcs" {
    bucket = "amplication-staging-oc-tfstate"
  }
}
