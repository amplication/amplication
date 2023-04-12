import { MESSAGE } from "triple-beam";
import { customFormat } from "./cli-format";
import { inspect } from "util";

const clc = {
  green: (text: string) => `\x1B[32m${text}\x1B[39m`,
  yellow: (text: string) => `\x1B[33m${text}\x1B[39m`,
  red: (text: string) => `\x1B[31m${text}\x1B[39m`,
  magentaBright: (text: string) => `\x1B[95m${text}\x1B[39m`,
  cyanBright: (text: string) => `\x1B[96m${text}\x1B[39m`,
};

describe("customFormat", () => {
  it.each`
    level      | colorFn
    ${"debug"} | ${clc.magentaBright}
    ${"info"}  | ${clc.green}
    ${"warn"}  | ${clc.yellow}
    ${"error"} | ${clc.red}
  `(
    "should format log messages with color and meta data",
    ({ level, colorFn }) => {
      const logMessage = "This is a test message";
      const componentName = "testComponent";
      const meta = {
        foo: "bar",
        baz: 123,
      };
      const timestamp = 1681311284136;

      const formattedLog = (
        customFormat().transform({
          level,
          message: logMessage,
          component: componentName,
          context: "here",
          timestamp,
          ...meta,
        }) as never
      )[MESSAGE];

      const expected = `${clc.cyanBright("[testComponent]")} ${colorFn(
        level
      )} ${timestamp} ${clc.cyanBright("[here]")} ${colorFn(
        "This is a test message"
      )}`;
      expect(formattedLog).toContain(expected);

      expect(formattedLog).toContain(
        inspect(JSON.parse(JSON.stringify(meta)), {
          colors: true,
          depth: null,
        })
      );
    }
  );
  it.each`
    level      | colorFn
    ${"info"}  | ${clc.green}
    ${"warn"}  | ${clc.yellow}
    ${"error"} | ${clc.red}
  `(
    "should format log messages with color and without meta data when meta is not serialisable",
    ({ level, colorFn }) => {
      const logMessage = "This is a test message";
      const componentName = "testComponent";

      const meta = { a: 1 };
      Object.assign(meta, { b: meta });

      const formattedLog = (
        customFormat().transform({
          level,
          message: logMessage,
          component: componentName,
          ...meta,
        }) as never
      )[MESSAGE];

      const expected = `${clc.cyanBright("[testComponent]")} ${colorFn(
        level
      )} ${colorFn("This is a test message")} {}`;
      expect(formattedLog).toContain(expected);
    }
  );
});
