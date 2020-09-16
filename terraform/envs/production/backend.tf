terraform {
  backend "gcs" {
    bucket = "amplication-production-tfstate"
  }
}
