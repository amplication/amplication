import { EnumResourceType } from "../../amplication-data-service-generator/src/models";
import { appInfo } from "../../amplication-data-service-generator/src/tests/appInfo";
import entities from "../../amplication-data-service-generator/src/tests/entities";
import roles from "../../amplication-data-service-generator/src/tests/roles";
import { writeFile } from "fs/promises";
import { join } from "path";
import { format } from "prettier";
import { plugins } from "../../amplication-data-service-generator/scripts/constants/example-plugins";

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
