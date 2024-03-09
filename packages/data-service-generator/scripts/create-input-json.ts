import fs from "fs";
import path from "path";
import { EnumResourceType } from "../src/models";
import { appInfo } from "../src/tests/appInfo";
import entities from "../src/tests/entities";
import roles from "../src/tests/roles";
import { join } from "path";
import { format } from "prettier";
import { plugins } from "../src/tests/mock-data-plugin-installations";
import {
  moduleActions,
  moduleContainers,
  moduleDtos,
} from "../src/tests/modules";

async function createInputJsonFile() {
  const object = {
    entities,
    roles,
    resourceInfo: appInfo,
    resourceType: EnumResourceType.Service,
    pluginInstallations: [plugins.postgres],
    moduleActions,
    moduleContainers,
    moduleDtos,
  };

  const buildSpecPath = process.env.BUILD_SPEC_PATH;

  if (!buildSpecPath) {
    throw new Error("SOURCE is not defined");
  }

  const relativePath = join(process.cwd(), buildSpecPath);

  fs.mkdirSync(path.dirname(relativePath), { recursive: true });

  fs.writeFileSync(
    relativePath,
    format(JSON.stringify(object), { parser: "json" })
  );

  console.log(`Finish writing the ${relativePath} file`);
}

if (require.main === module) {
  createInputJsonFile();
}
