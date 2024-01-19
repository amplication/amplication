import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { PrismaService, UserAction } from "../../prisma";
import { ActionService } from "../action/action.service";
import { EnumActionStepStatus } from "../action/dto";
import { UserActionService } from "../userAction/userAction.service";
import { EXAMPLE_RESOURCE } from "./__tests__/resource.mock";
import { AiService } from "./ai.service";
import {
  GENERATING_BTM_RESOURCE_RECOMMENDATION_STEP_NAME,
  GENERATING_BTM_RESOURCE_RECOMMENDATION_USER_ACTION_TYPE,
} from "./constants";
import { PromptManagerService } from "./prompt-manager.service";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { TestingModule, Test } from "@nestjs/testing";
import { BtmManagerService } from "./btm-manager.service";

jest.mock("../../prisma");
jest.mock("./prompt-manager.service");
jest.mock("@amplication/util/nestjs/kafka");

describe("AiService", () => {
  let service: AiService;
  const mockPrismaUserActionFindFirst = jest.fn().mockResolvedValue(null);
  const mockActionServiceComplete = jest.fn().mockResolvedValue(null);

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ActionService,
          useValue: {
            complete: mockActionServiceComplete,
          },
        },
        MockedAmplicationLoggerProvider,
        {
          provide: BtmManagerService,
          useValue: {
            translateToBtmRecommendation: jest.fn().mockResolvedValue(null),
          },
        },
        AiService,
        PromptManagerService,
        KafkaProducerService,
        UserActionService,
        {
          provide: PrismaService,
          useValue: {
            action: {
              findUnique: jest.fn().mockResolvedValue(null),
              create: jest.fn().mockResolvedValue(null),
              complete: jest.fn().mockResolvedValue(null),
            },
            resource: {
              findUnique: jest.fn().mockResolvedValue(EXAMPLE_RESOURCE),
            },
            userAction: {
              create: jest.fn().mockResolvedValue(null),
              findFirst: mockPrismaUserActionFindFirst,
              update: jest.fn().mockResolvedValue(null),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("triggerGenerationBtmResourceRecommendation", () => {
    it("should return the generated prompt", async () => {
      const resourceId = "resourceId";
      const userId = "resourceId";

      jest
        .spyOn(
          PromptManagerService.prototype,
          "generatePromptForBreakTheMonolith"
        )
        .mockReturnValue("Ciao ciao");

      const spyOnCreateUserActionByTypeWithInitialStep = jest
        .spyOn(
          UserActionService.prototype,
          "createUserActionByTypeWithInitialStep"
        )
        .mockResolvedValue({
          actionId: "actionId",
        } as unknown as UserAction);

      const result = await service.triggerGenerationBtmResourceRecommendation({
        resourceId,
        userId,
      });

      expect(result).toEqual("Ciao ciao");
      expect(spyOnCreateUserActionByTypeWithInitialStep).toBeCalledWith(
        GENERATING_BTM_RESOURCE_RECOMMENDATION_USER_ACTION_TYPE,
        expect.objectContaining({
          resourceId,
          conversationTypeKey: "BREAK_THE_MONOLITH",
        }),
        expect.objectContaining({
          name: GENERATING_BTM_RESOURCE_RECOMMENDATION_STEP_NAME,
        }),
        resourceId,
        userId
      );
    });
  });

  describe("onConversationCompleted", () => {
    it.each([
      [EnumActionStepStatus.Success, true],
      [EnumActionStepStatus.Failed, false],
    ])(
      "should update the action status to %s when the conversion completion success is %s",
      async (expectedActionStatus, success) => {
        const result = success ? "A magic anwser" : null;
        const errorMessage = success ? null : "An error happened";
        const actionId = "actionId";
        const requestUniqueId = "requestUniqueId";

        const actionStepToComplete = {
          id: "actionStepId",
        };

        mockPrismaUserActionFindFirst.mockResolvedValue({
          action: {
            steps: [actionStepToComplete],
          },
        } as unknown as UserAction);

        const res = await service.onConversationCompleted({
          actionId,
          requestUniqueId,
          success,
          result,
          errorMessage,
        });

        expect(res).toBeTruthy();

        expect(mockPrismaUserActionFindFirst).toHaveBeenCalledTimes(1);
        expect(mockActionServiceComplete).toHaveBeenCalledWith(
          actionStepToComplete,
          expectedActionStatus
        );
      }
    );
  });
});
