import { DSGResourceData, FileMap } from "@amplication/code-gen-types";
import { AstNode, Writer } from "@amplication/csharp-ast";
import {
  BuildManagerNotifier,
  getFileEncoding,
  logger as internalLogger,
} from "@amplication/dsg-utils";
import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { createDataService } from "./create-data-service";
import DsgContext from "./dsg-context";
export const AMPLICATION_MODULES = "amplication_modules";

async function readInputJson(filePath: string): Promise<DSGResourceData> {
  const file = await readFile(filePath, "utf8");
  const resourceData: DSGResourceData = JSON.parse(file);
  return resourceData;
}

async function writeModules(
  files: FileMap<AstNode>,

  destination: string
): Promise<void> {
  internalLogger.info("Creating base directory");
  await mkdir(destination, { recursive: true });
  internalLogger.info(`Writing modules to ${destination} ...`);

  for await (const file of files.getAll()) {
    const filePath = join(destination, file.path);
    await mkdir(dirname(filePath), { recursive: true });
    const writer = new Writer({ namespace: "" });
    file.code.write(writer);
    try {
      const encoding = getFileEncoding(filePath);
      await writeFile(filePath, writer.toString(), {
        encoding: encoding,
        flag: "wx",
      });
    } catch (error) {
      if (error.code === "EEXIST") {
        internalLogger.warn(`File ${filePath} already exists`);
      } else {
        internalLogger.error(`Failed to write file ${filePath}`, { ...error });
        throw error;
      }
    }
  }

  internalLogger.info(`Successfully wrote modules to ${destination}`);
}

export const generateCodeByResourceData = async (
  resourceData: DSGResourceData,
  destination: string
): Promise<void> => {
  try {
    const files = await createDataService(
      resourceData,
      internalLogger,
      join(__dirname, "..", AMPLICATION_MODULES)
    );

    await writeModules(files, destination);
    const context = DsgContext.getInstance;

    await context.logger.info("Code generation completed");
  } catch (error) {
    internalLogger.error(error.message, error);
    throw error;
  }
};

export const generateCode = async (): Promise<void> => {
  const context = DsgContext.getInstance;
  const buildSpecPath = process.env.BUILD_SPEC_PATH;
  const buildOutputPath = process.env.BUILD_OUTPUT_PATH;

  if (!buildSpecPath) {
    throw new Error("SOURCE is not defined");
  }
  if (!buildOutputPath) {
    throw new Error("DESTINATION is not defined");
  }

  const buildManagerNotifier = new BuildManagerNotifier({
    buildManagerUrl: process.env.BUILD_MANAGER_URL,
    resourceId: process.env.RESOURCE_ID,
    buildId: process.env.BUILD_ID,
  });

  try {
    const resourceData = await readInputJson(buildSpecPath);
    await generateCodeByResourceData(resourceData, buildOutputPath);

    await buildManagerNotifier.success();
  } catch (error) {
    await context.logger.info(`Failed to generate code: ${error.message}`);
    await buildManagerNotifier.failure();
    throw error;
  }
};
