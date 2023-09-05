import fs from "fs";
import { injectVariables } from "./inject-variables";

const NX_REACT_APP_EXAMPLE_VAR = "NX_REACT_APP_EXAMPLE_VAR";
const NX_REACT_APP_OTHER_EXAMPLE_VAR = "REACT_APP_OTHER_EXAMPLE_VAR";
const EXAMPLE_NON_REACT_APP_VAR = "EXAMPLE_NON_REACT_APP_VAR";
const EXAMPLE_VALUE = "EXAMPLE_VALUE";
const EXAMPLE_REACT_APP_ENV_VARS = {
  [NX_REACT_APP_EXAMPLE_VAR]: EXAMPLE_VALUE,
  [NX_REACT_APP_OTHER_EXAMPLE_VAR]: EXAMPLE_VALUE,
};
const EXAMPLE_ENVIRONMENT = {
  ...EXAMPLE_REACT_APP_ENV_VARS,
  [EXAMPLE_NON_REACT_APP_VAR]: EXAMPLE_VALUE,
};
const EXAMPLE_HTML = `<html>
<head>
</head>
<body>
</body>
</html>`;
// const UPDATED_HTML = `<html>
// <head>
// <script>Object.assign(window, ${JSON.stringify(
//   EXAMPLE_REACT_APP_ENV_VARS
// )})</script></head>
// <body>
// </body>
// </html>`;
const EXAMPLE_HTML_FILE_PATH = "/example/index.html";

const readFileMock = jest.fn();
const writeFileMock = jest.fn();

jest.mock("fs");

// @ts-ignore
fs.promises = {
  readFile: readFileMock,
  writeFile: writeFileMock,
};

describe("getReactAppEnv", () => {
  const cases: Array<[string, Record<string, string>, Record<string, string>]> =
    [
      [
        "Single react resource env var",
        { [NX_REACT_APP_EXAMPLE_VAR]: EXAMPLE_VALUE },
        { [NX_REACT_APP_EXAMPLE_VAR]: EXAMPLE_VALUE },
      ],
      [
        "Single react resource env var and non react resource env var",
        {
          [NX_REACT_APP_EXAMPLE_VAR]: EXAMPLE_VALUE,
          [EXAMPLE_NON_REACT_APP_VAR]: EXAMPLE_VALUE,
        },
        { [NX_REACT_APP_EXAMPLE_VAR]: EXAMPLE_VALUE },
      ],
      [
        "Single react resource env var and non react resource env var",
        {
          [NX_REACT_APP_EXAMPLE_VAR]: EXAMPLE_VALUE,
          [EXAMPLE_NON_REACT_APP_VAR]: EXAMPLE_VALUE,
        },
        { [NX_REACT_APP_EXAMPLE_VAR]: EXAMPLE_VALUE },
      ],
      [
        "Two react resource env vars and non react resource env var",
        {
          [NX_REACT_APP_EXAMPLE_VAR]: EXAMPLE_VALUE,
          [NX_REACT_APP_OTHER_EXAMPLE_VAR]: EXAMPLE_VALUE,
          [EXAMPLE_NON_REACT_APP_VAR]: EXAMPLE_VALUE,
        },
        {
          [NX_REACT_APP_EXAMPLE_VAR]: EXAMPLE_VALUE,
          [NX_REACT_APP_OTHER_EXAMPLE_VAR]: EXAMPLE_VALUE,
        },
      ],
    ];
  test.each(cases)("%s", (name, environment, expected) => {
    // expect(getReactAppEnv(environment)).toEqual(expected);
  });
});

describe("injectVariables", () => {
  test("injects variables to HTML file", async () => {
    // @ts-ignore
    fs.promises.readFile.mockImplementation(() => EXAMPLE_HTML);
    // @ts-ignore
    fs.promises.writeFile.mockImplementation(() => {});
    expect(
      await injectVariables(EXAMPLE_ENVIRONMENT, EXAMPLE_HTML_FILE_PATH)
    ).toBeUndefined();
    expect(readFileMock).toBeCalledTimes(1);
    expect(readFileMock).toBeCalledWith(EXAMPLE_HTML_FILE_PATH, "utf-8");
    expect(writeFileMock).toBeCalledTimes(1);
    // expect(writeFileMock).toBeCalledWith(EXAMPLE_HTML_FILE_PATH, UPDATED_HTML);
  });
});
