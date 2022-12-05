import { EnumResourceType } from "../src/models";
import { appInfo } from "../src/tests/appInfo";
import entities from "../src/tests/entities";
import { installedPlugins } from "../src/tests/pluginInstallation";
import roles from "../src/tests/roles";
import { writeFile } from "fs/promises";
import { join } from "path";
import { format } from "prettier";

async function createInputJsonFile() {
  const object = {
    entities,
    roles,
    resourceInfo: appInfo,
    resourceType: EnumResourceType.Service,
    pluginInstallations: installedPlugins,
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
