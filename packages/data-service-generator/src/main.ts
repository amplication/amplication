import { generateCode } from "./generate-code";
import { defaultLogger as logger } from "./logging";

if (require.main === module) {
  generateCode().catch(async (err) => {
    logger.error(err);
    process.exit(1);
  });
}
