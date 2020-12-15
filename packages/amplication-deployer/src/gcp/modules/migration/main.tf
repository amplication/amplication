module "cloud_build_build" {
  source = "../cloud-build-build"
  configuration = {
    steps : [
      {
        name : "gcr.io/cloud-builders/docker"
        args : ["pull", "gcr.io/cloudsql-docker/gce-proxy:1.11"]
      },
      {
        name : "gcr.io/cloud-builders/docker"
        args : [
          "run",
          "-d",
          "--network=cloudbuild",
          "-v",
          "/cloudsql:/cloudsql",
          "gcr.io/cloudsql-docker/gce-proxy:1.11",
          "/cloud_sql_proxy",
          "-dir=/cloudsql",
          "-instances=$PROJECT_ID:$_REGION:$_DB_INSTANCE",
        ]
      },
      {
        name : "gcr.io/cloud-builders/docker",
        args : [
          "run",
          "--network=cloudbuild",
          "-v",
          "/cloudsql:/cloudsql",
          "--env",
          "POSTGRESQL_URL=postgresql://$_POSTGRESQL_USER:$_POSTGRESQL_PASSWORD@127.0.0.1/$_POSTGRESQL_DB?host=/cloudsql/$PROJECT_ID:$_REGION:$_DB_INSTANCE",
          "--env",
          "BCRYPT_SALT=$_BCRYPT_SALT",
          "--workdir",
          "/app/server",
          "$_IMAGE_ID",
          "sh",
          "-c",
          "npm run db:clean; npm run db:init",
        ]
      }
    ]
  }
  substitutions = [
    "_IMAGE_ID=${var.image_id}",
    "_REGION=${var.region}",
    "_DB_INSTANCE=${var.database_instance}",
    "_POSTGRESQL_USER=${var.database_user}",
    "_POSTGRESQL_PASSWORD=${var.database_password}",
    "_POSTGRESQL_DB=${var.database_name}",
    "_BCRYPT_SALT=${var.bcrypt_salt}"
  ]
}
