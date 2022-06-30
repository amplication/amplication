import { google } from "@google-cloud/cloudbuild/build/protos/protos";
import { Variables } from "../types";
import { BackendConfiguration } from "../types/BackendConfiguration";

export const BASE_INIT_STEP: google.devtools.cloudbuild.v1.IBuildStep = {
  name: "hashicorp/terraform:0.13.5",
  args: ["init", "-lock-timeout=1200s"],
};

export const APPLY_STEP: google.devtools.cloudbuild.v1.IBuildStep = {
  name: "hashicorp/terraform:0.13.5",
  args: ["apply", "-auto-approve", "-lock-timeout=1200s"],
};

export const DESTROY_STEP: google.devtools.cloudbuild.v1.IBuildStep = {
  name: "hashicorp/terraform:0.13.5",
  args: ["destroy", "-auto-approve", "-lock-timeout=1200s"],
};

export const OUTPUT_STEP: google.devtools.cloudbuild.v1.IBuildStep = {
  id: "terraform-output",
  name: "hashicorp/terraform:0.13.5",
  args: ["output", "-json"],
};

export const DEFAULT_TAGS = ["deployer"];
export const DEFAULT_DESTROY_TAGS = ["destroy"];

export function createConfig(
  bucket: string,
  archiveFileName: string,
  backendConfiguration: BackendConfiguration = {},
  variables: Variables = {}
): google.devtools.cloudbuild.v1.IBuild {
  const initStep = createInitStep(
    Object.entries(backendConfiguration).map(([key, value]) =>
      createBackendConfigParameter(key, value)
    )
  );
  return {
    steps: [initStep, APPLY_STEP, OUTPUT_STEP],
    source: {
      storageSource: {
        bucket,
        object: archiveFileName,
      },
    },
    // Tags format: ^[\w][\w.-]{0,127}$
    tags: [
      ...DEFAULT_TAGS,
      ...Object.entries(variables).map(([key, value]) => createTag(key, value)),
    ],
  };
}

export function createDestroyConfig(
  bucket: string,
  archiveFileName: string,
  backendConfiguration: BackendConfiguration = {},
  variables: Variables = {}
): google.devtools.cloudbuild.v1.IBuild {
  const initStep = createInitStep(
    Object.entries(backendConfiguration).map(([key, value]) =>
      createBackendConfigParameter(key, value)
    )
  );
  return {
    steps: [initStep, DESTROY_STEP, OUTPUT_STEP],
    source: {
      storageSource: {
        bucket,
        object: archiveFileName,
      },
    },
    // Tags format: ^[\w][\w.-]{0,127}$
    tags: [
      ...DEFAULT_DESTROY_TAGS,
      ...Object.entries(variables).map(([key, value]) => createTag(key, value)),
    ],
  };
}

function createTag(key: string, value: string): string {
  return `${key}-${value}`.replace(/[^\w.-]/g, "-").slice(0, 127);
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
