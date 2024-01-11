import { AMPLICATION_MODULES } from "../generate-code";
import { join } from "path";

/**
 *
 * @param fileName __filename
 * @returns
 */
export const getTemporaryPluginInstallationPath = (
  fileName: string
): string => {
  const specFileName = fileName.split("/").pop().replaceAll(".", "_");
  return join(__dirname, "../../", AMPLICATION_MODULES, specFileName);
};
