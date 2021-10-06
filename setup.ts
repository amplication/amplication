async function main() {
  console.log("Setting up the project");
  const { engines } = require("./package.json");
  const { node } = engines;
}
if (require.main === module) {
  main();
}
