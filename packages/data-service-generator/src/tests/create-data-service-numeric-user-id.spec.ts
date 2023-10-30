import { types } from "@amplication/code-gen-types";
import { MockedLogger } from "@amplication/util/logging/test-utils";
import { createDataService } from "../create-data-service";
import { EnumDataType } from "../models";
import { USER_ENTITY_NAME } from "../server/user-entity/user-entity";
import { MODULE_EXTENSIONS_TO_SNAPSHOT } from "./appInfo";
import entities from "./entities";
import { TEST_DATA } from "./test-data";
import { join } from "path";
import { AMPLICATION_MODULES } from "../generate-code";

jest.setTimeout(100000);

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
  describe("when using a numeric user id", () => {
    test("creates resource as expected", async () => {
      const modules = await createDataService(
        TEST_DATA,
        MockedLogger,
        join(__dirname, "../../", AMPLICATION_MODULES)
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
});
