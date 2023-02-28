import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { DiffService } from "../../src/diff/diff.service";
import { MOCK_BUILD_PATH_FACTORY } from "./mocks";

const resourceId = "resourceId";

const logger = {
  debug: jest.fn(),
  log: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
  format: Symbol("EXAMPLE_LOGGER_FORMAT"),
} as unknown as AmplicationLogger;

describe("Testing the diff service", () => {
  let diffService: DiffService;
  beforeEach(() => {
    diffService = new DiffService(MOCK_BUILD_PATH_FACTORY, logger);
  });
  it("should throw error if the builds id is the same", () => {
    return expect(
      diffService.listOfChangedFiles(resourceId, "same", "same")
    ).rejects.toThrowError();
  });
});
