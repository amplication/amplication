import { EnumResourceType } from "../src/models";
import { appInfo } from "../src/tests/appInfo";
import entities from "../src/tests/entities";
import roles from "../src/tests/roles";
import { writeFile } from "fs/promises";
import { join } from "path";
import { format } from "prettier";
import { plugins } from "./constants/example-plugins";

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
