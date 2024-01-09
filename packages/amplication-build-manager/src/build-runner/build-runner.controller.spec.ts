import { Test, TestingModule } from "@nestjs/testing";
import { CodeGenerationRequest } from "@amplication/schema-registry";
import { CodeGeneratorVersionStrategy } from "@amplication/code-gen-types/models";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";

import { BuildRunnerController } from "./build-runner.controller";
import { BuildRunnerService } from "./build-runner.service";
import { CodeGenerationSuccessDto } from "./dto/CodeGenerationSuccess";
import { CodeGenerationFailureDto } from "./dto/CodeGenerationFailure";
import { AppInfo } from "@amplication/code-gen-types";
import { EnumJobStatus } from "../types";

describe("BuildRunnerController", () => {
  let controller: BuildRunnerController;
  let buildRunnerService: BuildRunnerService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [BuildRunnerController],
      providers: [
        {
          provide: BuildRunnerService,
          useClass: jest.fn(() => ({
            runBuild: jest.fn(),
            processBuildResult: jest.fn(),
          })),
        },
        MockedAmplicationLoggerProvider,
      ],
    }).compile();

    controller = module.get<BuildRunnerController>(BuildRunnerController);
    buildRunnerService = module.get<BuildRunnerService>(BuildRunnerService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("onCodeGenerationSuccess", () => {
    it("should call processBuildResult with Success", async () => {
      const dto: CodeGenerationSuccessDto = {
        buildId: "buildId",
        resourceId: "resourceId",
      };
      const spyOnProcessBuildResult = jest.spyOn(
        buildRunnerService,
        "processBuildResult"
      );
      await controller.onCodeGenerationSuccess(dto);
      expect(spyOnProcessBuildResult).toHaveBeenCalledWith(
        dto.resourceId,
        dto.buildId,
        EnumJobStatus.Success
      );
    });
  });

  describe("onCodeGenerationFailure", () => {
    it("should call processBuildResult with Failure", async () => {
      const dto: CodeGenerationFailureDto = {
        buildId: "buildId",
        resourceId: "resourceId",
        error: new Error("Test Error"),
      };
      const spyOnProcessBuildResult = jest.spyOn(
        buildRunnerService,
        "processBuildResult"
      );
      await controller.onCodeGenerationFailure(dto);
      expect(spyOnProcessBuildResult).toHaveBeenCalledWith(
        dto.resourceId,
        dto.buildId,
        EnumJobStatus.Failure,
        dto.error
      );
    });
  });

  describe("onCodeGenerationRequest", () => {
    it("should call runBuild", async () => {
      const codeGenerationRequestDTOMock: CodeGenerationRequest.Value = {
        resourceId: "resourceId",
        buildId: "buildId",
        dsgResourceData: {
          resourceType: "Service",
          buildId: "12345",
          pluginInstallations: [],
          resourceInfo: {
            codeGeneratorVersionOptions: {
              version: "2.0.0",
              selectionStrategy: CodeGeneratorVersionStrategy.Specific,
            },
          } as unknown as AppInfo,
        },
      };
      const spyOnRunBuild = jest.spyOn(buildRunnerService, "runBuild");
      await controller.onCodeGenerationRequest(codeGenerationRequestDTOMock);
      expect(spyOnRunBuild).toHaveBeenCalledWith(
        codeGenerationRequestDTOMock.resourceId,
        codeGenerationRequestDTOMock.buildId,
        codeGenerationRequestDTOMock.dsgResourceData
      );
    });
  });
});
