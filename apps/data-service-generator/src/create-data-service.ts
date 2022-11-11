import winston from "winston";

import { defaultLogger } from "./server/logging";
import { Module, DSGResourceData } from "@amplication/code-gen-types";
import { createDataServiceImpl } from "./create-data-service-impl";
import { EnumResourceType } from "./models";

export async function createDataService(
  dSGResourceData: DSGResourceData,
  logger: winston.Logger = defaultLogger
): Promise<Module[]> {
  if (dSGResourceData.resourceType === EnumResourceType.MessageBroker) {
    logger.info("No code to generate for a message broker");
    return [];
  }
  return await createDataServiceImpl(dSGResourceData, logger);
}
