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
  await writeFile(
    join(__dirname, "../input.json"),
    format(JSON.stringify(object), { parser: "json" })
  );
}

if (require.main === module) {
  (async () => {
    await createInputJsonFile();
  })();
}
