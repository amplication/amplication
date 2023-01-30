import fs from "fs";
import path from "path";
import { EnumResourceType } from "../src/models";
import { appInfo } from "../src/tests/appInfo";
import entities from "../src/tests/entities";
import roles from "../src/tests/roles";
import { writeFileSync } from "fs";
import { join } from "path";
import { format } from "prettier";

if (require.main === module) {
  createInputJsonFile();
}

function createInputJsonFile() {
  const object = {
    entities,
    roles,
    resourceInfo: appInfo,
    resourceType: EnumResourceType.Service,
    pluginInstallations: [],
  };
  const buildSpecPath = process.env.BUILD_SPEC_PATH;

  if (!buildSpecPath) {
    throw new Error("SOURCE is not defined");
  }

  const relativePath = join(process.cwd(), buildSpecPath);

  fs.mkdir(path.dirname(relativePath), { recursive: true }, (err) => {
    if (err) {
      console.error;
      throw err;
    }
  });

  writeFileSync(
    relativePath,
    format(JSON.stringify(object), { parser: "json" })
  );
  console.log(`Finish writing the ${relativePath} file`);
}
