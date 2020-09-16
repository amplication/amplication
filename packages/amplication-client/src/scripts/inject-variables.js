/**
 * This module is written in JavaScript instead of TypeScript so it can be
 * executed without being compiled.
 */

const fs = require("fs");

const ENV_VARS_PLACEHOLDER = "ENVIRONMENT_VARIABLES";
exports.ENV_VARS_PLACEHOLDER = ENV_VARS_PLACEHOLDER;
const REACT_APP_ENV_REGEXP = /^REACT_APP_/;

if (require.main === module) {
  const [, , htmlFile] = process.argv;
  if (!htmlFile) {
    throw new Error("Must pass one argument: HTML_FILE");
  }
  injectVariables(process.env, htmlFile).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

/**
 * Inject REACT_APP_ environment variables to given htmlFile
 * @param {Object} environment
 * @param {string} htmlFile
 */
async function injectVariables(environment, htmlFile) {
  const vars = getReactAppEnv(environment);
  const html = await fs.promises.readFile(htmlFile, "utf-8");
  const updatedHTML = html.replace(ENV_VARS_PLACEHOLDER, JSON.stringify(vars));
  await fs.promises.writeFile(htmlFile, updatedHTML);
  console.info("Updated client environment variables");
}

exports.injectVariables = injectVariables;

/**
 * Get only REACT_APP_ environment variables from given environment object
 * @param {Object} environment
 * @returns environment with REACT_APP_ environment variables only
 */
function getReactAppEnv(environment) {
  return Object.fromEntries(
    Object.entries(environment).filter(([key]) =>
      key.match(REACT_APP_ENV_REGEXP)
    )
  );
}

exports.getReactAppEnv = getReactAppEnv;
