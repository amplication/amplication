import { MESSAGE } from "triple-beam";
import { customFormat } from "./cli-format";
import { inspect } from "util";
import { SPLAT } from "triple-beam";

const clc = {
  green: (text: string) => `\x1B[32m${text}\x1B[39m`,
  yellow: (text: string) => `\x1B[33m${text}\x1B[39m`,
  red: (text: string) => `\x1B[31m${text}\x1B[39m`,
  magentaBright: (text: string) => `\x1B[95m${text}\x1B[39m`,
  cyanBright: (text: string) => `\x1B[96m${text}\x1B[39m`,
};

describe("customFormat", () => {
  it.each`
    level      | colorFn              | timestamp
    ${"debug"} | ${clc.magentaBright} | ${1681311284136}
    ${"info"}  | ${clc.green}         | ${undefined}
    ${"warn"}  | ${clc.yellow}        | ${undefined}
    ${"error"} | ${clc.red}           | ${undefined}
  `(
    "should format log messages with color and meta data",
    ({ level, colorFn, timestamp }) => {
      const logMessage = "This is a test message";
      const componentName = "testComponent";
      const meta = {
        foo: "bar",
        baz: 123,
        [SPLAT]: ["TEST"],
      };

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

      const expected = `${clc.cyanBright("[testComponent]")} ${colorFn(level)}${
        timestamp ? " " + timestamp : ""
      } ${clc.cyanBright("[here]")} ${colorFn("This is a test message")}`;
      expect(formattedLog).toContain(expected);

      expect(formattedLog).toContain(
        inspect(
          {
            foo: "bar",
            baz: 123,
            i: ["TEST"],
          },
          {
            colors: true,
            depth: null,
          }
        )
      );
    }
  );
});
