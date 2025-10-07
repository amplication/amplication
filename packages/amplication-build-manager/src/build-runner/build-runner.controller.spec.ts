import { Test, TestingModule } from "@nestjs/testing";
import { CodeGenerationRequest } from "@amplication/schema-registry";
import { CodeGeneratorVersionStrategy } from "@amplication/code-gen-types";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";

import { BuildRunnerController } from "./build-runner.controller";
import { BuildRunnerService } from "./build-runner.service";
import { CodeGenerationSuccessDto } from "./dto/CodeGenerationSuccess";
import { CodeGenerationFailureDto } from "./dto/CodeGenerationFailure";
import { AppInfo } from "@amplication/code-gen-types";

const onCodeGenerationSuccessMock = jest.fn();
const onCodeGenerationFailureMock = jest.fn();

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
            onCodeGenerationSuccess: onCodeGenerationSuccessMock,
            onCodeGenerationFailure: onCodeGenerationFailureMock,
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

      await controller.onCodeGenerationSuccess(dto);
      expect(onCodeGenerationSuccessMock).toHaveBeenCalledWith(dto);
    });
  });

  describe("onCodeGenerationFailure", () => {
    it("should call processBuildResult with Failure", async () => {
      const dto: CodeGenerationFailureDto = {
        buildId: "buildId",
        resourceId: "resourceId",
      };

      await controller.onCodeGenerationFailure(dto);
      expect(onCodeGenerationFailureMock).toHaveBeenCalledWith(dto);
    });
  });

  describe("onCodeGenerationRequest", () => {
    it("should call runBuild", async () => {
      const codeGenerationRequestDTOMock: CodeGenerationRequest.Value = {
        resourceId: "resourceId",
        buildId: "buildId",
      };
      const spyOnRunBuild = jest.spyOn(buildRunnerService, "runBuild");
      await controller.onCodeGenerationRequest(codeGenerationRequestDTOMock);
      expect(spyOnRunBuild).toHaveBeenCalledWith(
        codeGenerationRequestDTOMock.resourceId,
        codeGenerationRequestDTOMock.buildId
      );
    });
  });
});
