data "google_project" "project" {
  project_id = var.project
}

output "email" {
  value = "${data.google_project.project.number}@cloudbuild.gserviceaccount.com"
}
