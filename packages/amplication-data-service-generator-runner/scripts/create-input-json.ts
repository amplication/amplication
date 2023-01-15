import { EnumResourceType } from "@amplication/data-service-generator/models";
import { appInfo } from "@amplication/data-service-generator/tests/appInfo";
import { plugins } from "@amplication/data-service-generator/tests/constants/example-plugins";
import entities from "@amplication/data-service-generator/tests/entities";
import roles from "@amplication/data-service-generator/tests/roles";
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
    pluginInstallations: [
      plugins.postgresPlugin,
      {
        id: "auth-api",
        enabled: true,
        version: "0.0.1",
        pluginId: "pluginId",
        npm: "@amplication/plugin-auth",
      },
    ],
  };
  const fileName = "input.json";
  const path = join(__dirname, `../${fileName}`);
  writeFileSync(path, format(JSON.stringify(object), { parser: "json" }));
  console.log(`Finish writing the ${fileName} file`);
}
