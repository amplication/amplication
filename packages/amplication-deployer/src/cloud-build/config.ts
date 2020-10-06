import { google } from "@google-cloud/cloudbuild/build/protos/protos";

const INIT_STEP = {
  name: "hashicorp/terraform:0.13.3",
  args: ["init"],
};

const APPLY_STEP = {
  name: "hashicorp/terraform:0.13.3",
  args: ["apply", "-auto-approve"],
};

export function createConfig(
  bucket: string,
  archiveFileName: string
): google.devtools.cloudbuild.v1.IBuild {
  return {
    steps: [INIT_STEP, APPLY_STEP],
    source: {
      storageSource: {
        bucket,
        object: archiveFileName,
      },
    },
  };
}
