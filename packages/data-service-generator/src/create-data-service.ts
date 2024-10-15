import { DSGResourceData, ModuleMap } from "@amplication/code-gen-types";
import normalize from "normalize-path";
import { name as generatorName } from "../package.json";
import { createAdminModules } from "./admin/create-admin";
import DsgContext from "./dsg-context";
import { EnumResourceType } from "./models";
import { prepareContext } from "./prepare-context";
import { createServer } from "./server/create-server";
import { ILogger } from "@amplication/util-logging";
import { prepareDefaultPlugins } from "./utils/dynamic-installation/defaultPlugins";
import { dynamicPackagesInstallations } from "@amplication/dsg-utils";
import { logger } from "@amplication/dsg-utils";
import { createDTOs } from "./server/resource/create-dtos";

export async function createDataService(
  dSGResourceData: DSGResourceData,
  internalLogger: ILogger,
  pluginInstallationPath?: string
): Promise<ModuleMap> {
  const context = DsgContext.getInstance;

  const { GIT_REF_NAME: gitRefName, GIT_SHA: gitSha } = process.env;
  await context.logger.info(
    `Running DSG ${generatorName} version: ${gitRefName} <${gitSha?.substring(
      0,
      7
    )}>`
  );

  dSGResourceData.pluginInstallations = prepareDefaultPlugins(
    dSGResourceData.pluginInstallations
  );

  await dynamicPackagesInstallations(
    dSGResourceData.pluginInstallations,
    pluginInstallationPath,
    internalLogger,
    context.logger
  );

  try {
    if (dSGResourceData.resourceType === EnumResourceType.MessageBroker) {
      internalLogger.info("No code to generate for a message broker");
      return null;
    }

    const startTime = Date.now();
    await prepareContext(
      dSGResourceData,
      internalLogger,
      pluginInstallationPath
    );

    await context.logger.info("Creating application...", {
      resourceId: dSGResourceData.resourceInfo.id,
      buildId: dSGResourceData.buildId,
    });

    await context.logger.info("Creating DTOs...");
    context.DTOs = await createDTOs(context.entities);

    const {
      appInfo: {
        settings: {
          serverSettings: { generateServer },
          adminUISettings: { generateAdminUI },
        },
      },
    } = context;

    const modules = new ModuleMap(context.logger);

    if (generateServer ?? true) {
      logger.debug("Creating server...", { generateServer });
      await modules.merge(await createServer());
    }

    if (generateAdminUI) {
      logger.debug("Creating admin...", { generateAdminUI });
      await modules.merge(await createAdminModules());
    }

    // This code normalizes the path of each module to always use Unix path separator.
    await context.logger.info(
      "Normalizing modules path to use Unix path separator"
    );
    await modules.replaceModulesPath((path) => normalize(path));

    const endTime = Date.now();
    internalLogger.info("Application creation time", {
      durationInMs: endTime - startTime,
    });

    await context.logger.info(
      "Creating application process finished successfully"
    );

    return modules;
  } catch (error) {
    await internalLogger.error("Failed to run createDataService", {
      ...error,
    });
    throw error;
  }
}
