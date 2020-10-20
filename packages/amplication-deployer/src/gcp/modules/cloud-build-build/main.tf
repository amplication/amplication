variable "configuration" {
  type = map
}

variable "substitutions" {
  type = list(string)
}

resource "null_resource" "local_gcloud" {
  triggers = {
    configuration = var.configuration
    substitutions = var.substitutions
  }
  provisioner "local-exec" {
    # Assumption: the module is running inside a terraform docker container (bashed on alpine linux)
    command = <<EOF
set -e;
apk add --update \
  python3 \
  curl \
  bash;
ln -sf python3 /usr/bin/python;
cat <<'EOT' > cloudbuild.yaml
${yamlencode(var.configuration)}
EOT
echo "Installing Google Cloud SDK...";
curl --silent --show-error https://sdk.cloud.google.com | bash > /dev/null 2>&1;
export PATH=$PATH:$HOME/google-cloud-sdk/bin;
echo "Submitting build...";
gcloud builds submit --no-source --config cloudbuild.yaml --substitutions ${join(",", var.substitutions)};
echo "Build is done";
    EOF
  }
}
