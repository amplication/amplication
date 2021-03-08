import { flags } from '@oclif/command';

export const OUTPUT_FORMAT_RAW = 'raw';
export const OUTPUT_FORMAT_STYLED_JSON = 'styledJSON';
export const OUTPUT_FORMAT_TABLE = 'table';

export const format = flags.build({
  char: 'f',
  description: 'The format in which to render the output',
  options: [OUTPUT_FORMAT_RAW, OUTPUT_FORMAT_STYLED_JSON, OUTPUT_FORMAT_TABLE],
  default: OUTPUT_FORMAT_RAW,
});
