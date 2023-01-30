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
  const fileName = "input.json";
  const path = join(__dirname, `../${fileName}`);
  writeFileSync(path, format(JSON.stringify(object), { parser: "json" }));
  console.log(`Finish writing the ${fileName} file`);
}
