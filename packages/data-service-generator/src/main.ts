import { generateCode } from "./generate-code";
import { logger } from "./logging";

if (require.main === module) {
  generateCode().catch(async (err) => {
    logger.error(err);
    process.exit(1);
  });
}
