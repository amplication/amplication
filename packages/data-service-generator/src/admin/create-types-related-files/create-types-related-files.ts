import path from "path";
import { promises as fs } from "fs";
import { Module, ModuleMap } from "@amplication/code-gen-types";
import {
  BIGINT_FILTER_FILE_NAME,
  BIGINT_NULLABLE_FILTER_FILE_NAME,
  DECIMAL_FILTER_FILE_NAME,
  DECIMAL_NULLABLE_FILTER_FILE_NAME,
} from "./constants";
import DsgContext from "../../dsg-context";
import { formatCode } from "@amplication/code-gen-utils";

export async function createTypesRelatedFiles(): Promise<ModuleMap> {
  const { logger } = DsgContext.getInstance;

  const moduleMap = new ModuleMap(logger);

  await logger.info("Creating BigIntFilters files...");
  await createBigIntFilters(moduleMap);

  await logger.info("Creating DecimalFilters files...");
  await createDecimalFilters(moduleMap);

  await logger.info("Formatting types related files...");
  await moduleMap.replaceModulesCode((path, code) => formatCode(path, code));

  return moduleMap;
}

async function createBigIntFilters(moduleMap: ModuleMap) {
  const { logger, clientDirectories, hasBigIntFields } = DsgContext.getInstance;

  if (!hasBigIntFields) {
    return new ModuleMap(logger);
  }

  const bigIntFilterFilePath = path.resolve(__dirname, BIGINT_FILTER_FILE_NAME);
  const bigIntNullableFilterFilePath = path.resolve(
    __dirname,
    BIGINT_NULLABLE_FILTER_FILE_NAME
  );
  const bigIntFilterFileContent = await fs.readFile(
    bigIntFilterFilePath,
    "utf-8"
  );
  const bigIntNullableFilterFileContent = await fs.readFile(
    bigIntNullableFilterFilePath,
    "utf-8"
  );

  const bigIntFilterModule: Module = {
    path: path.join(
      clientDirectories.srcDirectory,
      "util/",
      BIGINT_FILTER_FILE_NAME
    ),
    code: bigIntFilterFileContent,
  };

  const bigIntNullableFilterModule: Module = {
    path: path.join(
      clientDirectories.srcDirectory,
      "util/",
      BIGINT_NULLABLE_FILTER_FILE_NAME
    ),
    code: bigIntNullableFilterFileContent,
  };

  await moduleMap.set(bigIntFilterModule);
  await moduleMap.set(bigIntNullableFilterModule);

  await moduleMap.replaceModulesPath((path) => path.replace(".template", ""));

  return moduleMap;
}

async function createDecimalFilters(moduleMap: ModuleMap) {
  const { logger, clientDirectories, hasDecimalFields } =
    DsgContext.getInstance;

  if (!hasDecimalFields) {
    return new ModuleMap(logger);
  }

  const decimalFilterFilePath = path.resolve(
    __dirname,
    DECIMAL_FILTER_FILE_NAME
  );
  const decimalNullableFilterFilePath = path.resolve(
    __dirname,
    DECIMAL_NULLABLE_FILTER_FILE_NAME
  );
  const decimalFilterFileContent = await fs.readFile(
    decimalFilterFilePath,
    "utf-8"
  );
  const decimalNullableFilterFileContent = await fs.readFile(
    decimalNullableFilterFilePath,
    "utf-8"
  );

  const decimalFilterModule: Module = {
    path: path.join(
      clientDirectories.srcDirectory,
      "util/",
      DECIMAL_FILTER_FILE_NAME
    ),
    code: decimalFilterFileContent,
  };

  const decimalNullableFilterModule: Module = {
    path: path.join(
      clientDirectories.srcDirectory,
      "util/",
      DECIMAL_NULLABLE_FILTER_FILE_NAME
    ),
    code: decimalNullableFilterFileContent,
  };

  await moduleMap.set(decimalFilterModule);
  await moduleMap.set(decimalNullableFilterModule);

  await moduleMap.replaceModulesPath((path) => path.replace(".template", ""));

  return moduleMap;
}
