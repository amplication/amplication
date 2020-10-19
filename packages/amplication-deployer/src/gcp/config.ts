import { google } from "@google-cloud/cloudbuild/build/protos/protos";
import { BackendConfiguration } from "../types/BackendConfiguration";

export const BASE_INIT_STEP: google.devtools.cloudbuild.v1.IBuildStep = {
  name: "hashicorp/terraform:0.13.4",
  args: ["init"],
};

export const APPLY_STEP: google.devtools.cloudbuild.v1.IBuildStep = {
  name: "hashicorp/terraform:0.13.4",
  args: ["apply", "-auto-approve"],
};

export function createConfig(
  bucket: string,
  archiveFileName: string,
  backendConfiguration: BackendConfiguration = {}
): google.devtools.cloudbuild.v1.IBuild {
  const initStep = createInitStep(
    Object.entries(backendConfiguration).map(([key, value]) =>
      createBackendConfigParameter(key, value)
    )
  );
  return {
    steps: [initStep, APPLY_STEP],
    source: {
      storageSource: {
        bucket,
        object: archiveFileName,
      },
    },
  };
}

export function createBackendConfigParameter(
  key: string,
  value: string
): string {
  return `-backend-config=${key}=${value}`;
}

export function createInitStep(
  parameters: string[]
): google.devtools.cloudbuild.v1.IBuildStep {
  const args = BASE_INIT_STEP.args || [];
  return {
    ...BASE_INIT_STEP,
    args: [...args, ...parameters],
  };
}
