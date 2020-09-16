terraform {
  backend "gcs" {
    bucket = "amplication-tfstate"
  }
}
