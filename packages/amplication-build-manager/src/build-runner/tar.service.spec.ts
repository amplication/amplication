import { Test, TestingModule } from "@nestjs/testing";
import { TarService } from "./tar.service";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { promises as fsPromises } from "fs";

jest.mock("fs", () => {
  const originalFs = jest.requireActual("fs");
  return {
    ...originalFs,
    promises: {
      ...originalFs.promises,
      access: jest.fn(),
      mkdir: jest.fn(),
      readdir: jest.fn(),
      stat: jest.fn(),
      readFile: jest.fn(),
      writeFile: jest.fn(),
    },
    createWriteStream: jest.fn(),
  };
});

jest.mock("tar-stream", () => ({
  pack: jest.fn(),
}));

describe("TarService", () => {
  let service: TarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TarService, MockedAmplicationLoggerProvider],
    }).compile();

    service = module.get<TarService>(TarService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("isPathExists", () => {
    it("should return true if the path exists", async () => {
      const path = "path";
      jest.spyOn(fsPromises, "access").mockResolvedValue(undefined);
      expect(await service.isPathExists(path)).toBe(true);
    });

    it("should return false if the path does not exist", async () => {
      const path = "path";
      jest.spyOn(fsPromises, "access").mockRejectedValue(undefined);
      expect(await service.isPathExists(path)).toBe(false);
    });
  });
});
