import { EnumResourceType } from "@amplication/data-service-generator/models";
import { appInfo } from "@amplication/data-service-generator/tests/appInfo";
import { plugins } from "@amplication/data-service-generator/tests/constants/example-plugins";
import entities from "@amplication/data-service-generator/tests/entities";
import roles from "@amplication/data-service-generator/tests/roles";
import { writeFile } from "fs/promises";
import { join } from "path";
import { format } from "prettier";

async function createInputJsonFile() {
  const object = {
    entities,
    roles,
    resourceInfo: appInfo,
    resourceType: EnumResourceType.Service,
    pluginInstallations: [plugins.kafka, plugins.postgresPlugin],
  };
  const fileName = "input.json";
  const path = join(__dirname, `../${fileName}`);
  await writeFile(path, format(JSON.stringify(object), { parser: "json" }));
  console.log(`Finish writing the ${fileName} file`);
}

if (require.main === module) {
  (async () => {
    await createInputJsonFile();
  })();
}
