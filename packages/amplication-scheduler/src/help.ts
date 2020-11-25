import help from "./help.json";

export function handleHelp() {
  const HELP_OPTIONS = new Set(["--help", "-h"]);
  if (process.argv.some((item) => HELP_OPTIONS.has(item))) {
    console.log(help);
    process.exit(0);
  }
}
