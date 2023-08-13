import { types } from "@amplication/code-gen-types";
import { createDataService } from "../create-data-service";
import { EnumDataType, EnumResourceType } from "../models";
import { USER_ENTITY_NAME } from "../server/user-entity/user-entity";
import { appInfo, MODULE_EXTENSIONS_TO_SNAPSHOT } from "./appInfo";
import entities from "./entities";
import { installedPlugins } from "./pluginInstallation";
import roles from "./roles";
import { MockedLogger } from "@amplication/util/logging/test-utils";

jest.setTimeout(100000);

jest.mock("./build-logger");

beforeAll(() => {
  const userEntity = entities.find((e) => e.name === USER_ENTITY_NAME);
  if (!userEntity) {
    throw new Error("User entity not found");
  }
  const idField = userEntity.fields.find(
    (field) => field.dataType === EnumDataType.Id
  );
  if (!idField) {
    throw new Error("User entity must have an id field");
  }
  (idField.properties as types.Id) = { idType: "AUTO_INCREMENT" };
});

describe("createDataService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("creates resource as expected", async () => {
    const modules = await createDataService(
      {
        entities,
        buildId: "example_build_id",
        roles,
        resourceInfo: appInfo,
        resourceType: EnumResourceType.Service,
        pluginInstallations: installedPlugins,
      },
      MockedLogger
    );
    const modulesToSnapshot = modules
      .modules()
      .filter((module) =>
        MODULE_EXTENSIONS_TO_SNAPSHOT.some((extension) =>
          module.path.endsWith(extension)
        )
      );
    const pathToCode = Object.fromEntries(
      modulesToSnapshot.map((module) => [module.path, module.code])
    );
    expect(pathToCode).toMatchSnapshot();
  });
});
