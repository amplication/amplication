const fs = require("fs");

const HTML_FILE = "/packages/amplication-client/build/index.html";
const ENV_VARS_PLACEHOLDER = "ENVIRONMENT_VARIABLES";
const REACT_APP_ENV_REGEXP = /^REACT_APP/;

if (require.main === module) {
  injectVariables().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

async function injectVariables() {
  const vars = Object.fromEntries(
    Object.entries(process.env).filter(([key]) =>
      key.match(REACT_APP_ENV_REGEXP)
    )
  );
  const html = await fs.promises.readFile(HTML_FILE, "utf-8");
  const updatedHTML = html.replace(ENV_VARS_PLACEHOLDER, JSON.stringify(vars));
  console.info("Updated client environment variables");
  fs.writeFile(HTML_FILE, updatedHTML);
}
