#!/usr/bin/env node

import { createJob } from "./scheduler";
import { getConfig } from "./get-config";
import { handleHelp } from "./help";

if (require.main === module) {
  handleHelp();
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

async function main() {
  const config = await getConfig();
  createJob(config);

  process.on("SIGINT", () => process.exit(0));
  process.on("SIGTERM", () => process.exit(0));
}
