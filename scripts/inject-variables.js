const fs = require("fs");

const HTML_FILE = "/packages/amplication-client/build/index.html";
exports.HTML_FILE = HTML_FILE;
const ENV_VARS_PLACEHOLDER = "ENVIRONMENT_VARIABLES";
exports.ENV_VARS_PLACEHOLDER = ENV_VARS_PLACEHOLDER;
const REACT_APP_ENV_REGEXP = /^REACT_APP/;

if (require.main === module) {
  injectVariables(process.env).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

exports.injectVariables = async function injectVariables(environment) {
  const vars = getReactAppEnv(environment);
  const html = await fs.promises.readFile(HTML_FILE, "utf-8");
  const updatedHTML = html.replace(ENV_VARS_PLACEHOLDER, JSON.stringify(vars));
  await fs.promises.writeFile(HTML_FILE, updatedHTML);
  console.info("Updated client environment variables");
};

exports.getReactAppEnv = function getReactAppEnv(environment) {
  return Object.fromEntries(
    Object.entries(environment).filter(([key]) =>
      key.match(REACT_APP_ENV_REGEXP)
    )
  );
};
