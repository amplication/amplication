import { google } from "@google-cloud/cloudbuild/build/protos/protos";
import { BackendConfiguration } from "../types/BackendConfiguration";

function createInitStep(
  parameters: string[]
): google.devtools.cloudbuild.v1.IBuildStep {
  return {
    name: "hashicorp/terraform:0.13.3",
    args: ["init", ...parameters],
  };
}

const APPLY_STEP: google.devtools.cloudbuild.v1.IBuildStep = {
  name: "hashicorp/terraform:0.13.3",
  args: ["apply", "-auto-approve"],
};

export function createConfig(
  bucket: string,
  archiveFileName: string,
  backendConfiguration: BackendConfiguration = {}
): google.devtools.cloudbuild.v1.IBuild {
  /** @todo extract to function */
  const initParameters = Object.entries(backendConfiguration).map(
    ([key, value]) => `-backend-config="${key}=${value}"`
  );
  return {
    steps: [createInitStep(initParameters), APPLY_STEP],
    source: {
      storageSource: {
        bucket,
        object: archiveFileName,
      },
    },
  };
}
