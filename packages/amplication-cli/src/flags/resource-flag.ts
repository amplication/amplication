import { flags } from "@oclif/command";

function getResource(params: any): string | undefined {
  const envResource = process.env.AMP_CURRENT_RESOURCE;
  if (envResource) return envResource;

  const configResource = params?.configJSON?.AMP_CURRENT_RESOURCE;
  if (configResource) return configResource;

  return undefined;
}
export const resource = flags.build({
  char: "r",
  description: "resource to run command against",
  default: getResource,
});
