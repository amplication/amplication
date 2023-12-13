import { format } from "winston";
import { Format } from "logform";
import { inspect } from "util";
import { LEVEL, MESSAGE, SPLAT } from "triple-beam";
const clc = {
  green: (text: string) => `\x1B[32m${text}\x1B[39m`,
  yellow: (text: string) => `\x1B[33m${text}\x1B[39m`,
  red: (text: string) => `\x1B[31m${text}\x1B[39m`,
  magentaBright: (text: string) => `\x1B[95m${text}\x1B[39m`,
  cyanBright: (text: string) => `\x1B[96m${text}\x1B[39m`,
};

const colorScheme: Record<string, (text: string) => string> = {
  info: clc.green,
  error: clc.red,
  warn: clc.yellow,
  debug: clc.magentaBright,
  verbose: clc.cyanBright,
};

export const customFormat = (): Format =>
  format.printf(({ context, level, timestamp, message, ms, ...meta }) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const color = colorScheme[level];
    const cyanBright = clc.cyanBright;

    // Deduplicate meta component
    /* istanbul ignore next */
    const {
      component: componentName,
      [LEVEL]: metaLevel,
      [MESSAGE]: metaMessage,
      [SPLAT]: metaSplat,
      ...metadata
    } = meta;

    const formattedMeta = inspect(metadata, {
      colors: true,
      depth: null,
      compact: true,
    });

    return (
      `${cyanBright(`[${componentName}]`)} ` +
      `${color(level)} ` +
      ("undefined" !== typeof timestamp ? `${timestamp} ` : "") +
      ("undefined" !== typeof context
        ? `${cyanBright("[" + context + "]")} `
        : "") +
      `${color(message)} ` +
      `${formattedMeta}` +
      ("undefined" !== typeof ms ? ` ${cyanBright(ms)}` : "")
    );
  });
