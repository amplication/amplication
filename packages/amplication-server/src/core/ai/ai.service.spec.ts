import { PrismaService, UserAction } from "../../prisma";
import { ActionService } from "../action/action.service";
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

jest.mock("../../prisma");
jest.mock("./prompt-manager.service");
jest.mock("@amplication/util/nestjs/kafka");

describe("AiService", () => {
  let service: AiService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ActionService,
          useValue: {},
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
            },
            resource: {
              findUnique: jest.fn().mockResolvedValue(EXAMPLE_RESOURCE),
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
});
