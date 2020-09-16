import fs from "fs";
import {
  getReactAppEnv,
  ENV_VARS_PLACEHOLDER,
  HTML_FILE,
  injectVariables,
} from "./inject-variables";

const REACT_APP_EXAMPLE_VAR = "REACT_APP_EXAMPLE_VAR";
const REACT_APP_OTHER_EXAMPLE_VAR = "REACT_APP_OTHER_EXAMPLE_VAR";
const EXAMPLE_NON_REACT_APP_VAR = "EXAMPLE_NON_REACT_APP_VAR";
const EXAMPLE_VALUE = "EXAMPLE_VALUE";
const EXAMPLE_REACT_APP_ENV_VARS = {
  [REACT_APP_EXAMPLE_VAR]: EXAMPLE_VALUE,
  [REACT_APP_OTHER_EXAMPLE_VAR]: EXAMPLE_VALUE,
};
const EXAMPLE_ENVIRONMENT = {
  ...EXAMPLE_REACT_APP_ENV_VARS,
  [EXAMPLE_NON_REACT_APP_VAR]: EXAMPLE_VALUE,
};
const EXAMPLE_HTML = `<html>
<body>
  <script>
    const envVars = ${ENV_VARS_PLACEHOLDER};
  </script>
</body>
</html>`;
const UPDATED_HTML = `<html>
<body>
  <script>
    const envVars = ${JSON.stringify(EXAMPLE_REACT_APP_ENV_VARS)};
  </script>
</body>
</html>`;

const readFileMock = jest.fn();
const writeFileMock = jest.fn();

jest.mock("fs");

// @ts-ignore
fs.promises = {
  readFile: readFileMock,
  writeFile: writeFileMock,
};

describe("getReactAppEnv", () => {
  const cases: Array<[
    string,
    Record<string, string>,
    Record<string, string>
  ]> = [
    [
      "Single react app env var",
      { [REACT_APP_EXAMPLE_VAR]: EXAMPLE_VALUE },
      { [REACT_APP_EXAMPLE_VAR]: EXAMPLE_VALUE },
    ],
    [
      "Single react app env var and non react app env var",
      {
        [REACT_APP_EXAMPLE_VAR]: EXAMPLE_VALUE,
        [EXAMPLE_NON_REACT_APP_VAR]: EXAMPLE_VALUE,
      },
      { [REACT_APP_EXAMPLE_VAR]: EXAMPLE_VALUE },
    ],
    [
      "Single react app env var and non react app env var",
      {
        [REACT_APP_EXAMPLE_VAR]: EXAMPLE_VALUE,
        [EXAMPLE_NON_REACT_APP_VAR]: EXAMPLE_VALUE,
      },
      { [REACT_APP_EXAMPLE_VAR]: EXAMPLE_VALUE },
    ],
    [
      "Two react app env vars and non react app env var",
      {
        [REACT_APP_EXAMPLE_VAR]: EXAMPLE_VALUE,
        [REACT_APP_OTHER_EXAMPLE_VAR]: EXAMPLE_VALUE,
        [EXAMPLE_NON_REACT_APP_VAR]: EXAMPLE_VALUE,
      },
      {
        [REACT_APP_EXAMPLE_VAR]: EXAMPLE_VALUE,
        [REACT_APP_OTHER_EXAMPLE_VAR]: EXAMPLE_VALUE,
      },
    ],
  ];
  test.each(cases)("%s", (name, environment, expected) => {
    expect(getReactAppEnv(environment)).toEqual(expected);
  });
});

describe("injectVariables", () => {
  test("injects variables to HTML file", async () => {
    // @ts-ignore
    fs.promises.readFile.mockImplementation(() => EXAMPLE_HTML);
    // @ts-ignore
    fs.promises.writeFile.mockImplementation(() => {});
    expect(await injectVariables(EXAMPLE_ENVIRONMENT)).toBeUndefined();
    expect(readFileMock).toBeCalledTimes(1);
    expect(readFileMock).toBeCalledWith(HTML_FILE, "utf-8");
    expect(writeFileMock).toBeCalledTimes(1);
    expect(writeFileMock).toBeCalledWith(HTML_FILE, UPDATED_HTML);
  });
});
