import { DSGResourceData, FileMap } from "@amplication/code-gen-types";
import normalize from "normalize-path";
import { name as generatorName } from "../package.json";
import DsgContext from "./dsg-context";
import { EnumResourceType } from "./models";
import { prepareContext } from "./prepare-context";
import { createBlueprint } from "./blueprint/create-blueprint";
import { ILogger } from "@amplication/util-logging";
import { prepareDefaultPlugins } from "./utils/dynamic-installation/defaultPlugins";
import { dynamicPackagesInstallations } from "@amplication/dsg-utils";
import { AstNode } from "@amplication/csharp-ast";

export async function createDataService(
  dSGResourceData: DSGResourceData,
  internalLogger: ILogger,
  pluginInstallationPath?: string
): Promise<FileMap<AstNode>> {
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

    await createBlueprint();

    // This code normalizes the path of each module to always use Unix path separator.
    await context.logger.info(
      "Normalizing modules path to use Unix path separator"
    );
    await context.files.replaceFilesPath((path) => normalize(path));

    const endTime = Date.now();
    internalLogger.info("Application creation time", {
      durationInMs: endTime - startTime,
    });

    await context.logger.info(
      "Creating application process finished successfully"
    );

    return context.files;
  } catch (error) {
    await internalLogger.error("Failed to run createDataService", {
      ...error,
    });
    throw error;
  }
}
