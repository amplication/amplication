import { DSGResourceData } from "@amplication/code-gen-types";
import { readFile } from "fs/promises";
import { httpClient } from "./utils/http-client";
import { generateCodeByResourceData } from "./generate-code";

const buildSpecPath = process.env.BUILD_SPEC_PATH;
const buildOutputPath = process.env.BUILD_OUTPUT_PATH;

if (!buildSpecPath) {
  throw new Error("SOURCE is not defined");
}
if (!buildOutputPath) {
  throw new Error("DESTINATION is not defined");
}

generateCode(buildSpecPath, buildOutputPath).catch((err) => {
  logger.error(err);
  process.exit(1);
});

async function readInputJson(filePath: string): Promise<DSGResourceData> {
  const file = await readFile(filePath, "utf8");
  const resourceData: DSGResourceData = JSON.parse(file);
  return resourceData;
}

export default async function generateCode(
  source: string,
  destination: string
): Promise<void> {
  try {
    const resourceData = await readInputJson(source);
    await generateCodeByResourceData(resourceData, destination);
    await httpClient.post(
      new URL(
        "build-runner/code-generation-success",
        process.env.BUILD_MANAGER_URL
      ).href,
      {
        resourceId: process.env.RESOURCE_ID,
        buildId: process.env.BUILD_ID,
      }
    );
  } catch (err) {
    logger.error(err);
    await httpClient.post(
      new URL(
        "build-runner/code-generation-failure",
        process.env.BUILD_MANAGER_URL
      ).href,
      {
        resourceId: process.env.RESOURCE_ID,
        buildId: process.env.BUILD_ID,
      }
    );
  }
}
