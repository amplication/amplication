import { BuildPathFactory } from "../../src/diff/build-path-factory";
import { ConfigService } from "@nestjs/config";
import { mock } from "jest-mock-extended";
import { join } from "path";

const rootEnvPath = "/users";
const resourceId = "resourceId";
const buildId = "buildId";

describe("Testing the BuildPathFactory", () => {
  let buildPathFactory;
  beforeEach(() => {
    const configService = mock<ConfigService>();
    configService.get.mockReturnValue(rootEnvPath);
    buildPathFactory = new BuildPathFactory(configService);
  });
  xit("should combine the root folder that get form the env, the folder with resourceId and the new buildId", () => {
    const path = buildPathFactory.get(resourceId, buildId);
    expect(path).toBe(join(rootEnvPath, resourceId, buildId));
  });
});
