import { flags } from "@oclif/command";

export const OUTPUT_FORMAT_JSON = "JSON";
export const OUTPUT_FORMAT_STYLED_JSON = "styledJSON";
export const OUTPUT_FORMAT_TABLE = "table";

function getFormat(params: any): string | undefined {
  const envFormat = process.env.AMP_OUTPUT_FORMAT;
  if (envFormat) return envFormat;

  const configFormat = params?.configJSON?.AMP_OUTPUT_FORMAT;
  if (configFormat) return configFormat;

  return OUTPUT_FORMAT_JSON;
}

export const format = flags.build({
  char: "f",
  description: "The format in which to render the output",
  options: [OUTPUT_FORMAT_JSON, OUTPUT_FORMAT_STYLED_JSON, OUTPUT_FORMAT_TABLE],
  default: getFormat,
});
