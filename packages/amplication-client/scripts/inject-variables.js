/**
 * This module is written in JavaScript instead of TypeScript so it can be
 * executed without being compiled.
 */

const fs = require("fs");

const REACT_APP_ENV_REGEXP = /^NX_REACT_APP_/;
const HTML_HEAD_CLOSING_TAG = "</head>";

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
  const script = createScript(vars);
  const updatedHTML = html.replace(
    HTML_HEAD_CLOSING_TAG,
    script + HTML_HEAD_CLOSING_TAG
  );
  await fs.promises.writeFile(htmlFile, updatedHTML);
  console.info("Updated client environment variables");
}

exports.injectVariables = injectVariables;

/**
 *
 * @param {Object} environment
 * @returns {string}
 */
function createScript(environment) {
  return `<script>Object.assign(window, ${JSON.stringify(
    environment
  )})</script>`;
}

exports.createScript = createScript;

/**
 * Get only REACT_APP_ environment variables from given environment object
 * @param {Object} environment
 * @returns {Object} environment with REACT_APP_ environment variables only
 */
function getReactAppEnv(environment) {
  return Object.fromEntries(
    Object.entries(environment).filter(([key]) =>
      key.match(REACT_APP_ENV_REGEXP)
    )
  );
}

exports.getReactAppEnv = getReactAppEnv;
