import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import {
  BtmEntityRecommendation,
  BtmResourceRecommendation,
  PrismaService,
  UserAction,
} from "../../prisma";
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
import { AiRecommendations } from "./dto";

jest.mock("../../prisma");
jest.mock("./prompt-manager.service");
jest.mock("@amplication/util/nestjs/kafka");

describe("AiService", () => {
  let service: AiService;
  const mockPrismaUserActionFindFirst = jest.fn().mockResolvedValue(null);
  const mockPrismaBtmResourceRecFindMany = jest.fn().mockResolvedValue([]);
  const mockActionServiceComplete = jest.fn().mockResolvedValue(null);

  const prismaServiceMock = {
    action: {
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(null),
      complete: jest.fn().mockResolvedValue(null),
    },

    resource: {
      findUnique: jest.fn().mockResolvedValue(EXAMPLE_RESOURCE),
    },
    btmResourceRecommendation: {
      findMany: mockPrismaBtmResourceRecFindMany,
    },
    userAction: {
      create: jest.fn().mockResolvedValue(null),
      findFirst: mockPrismaUserActionFindFirst,
      update: jest.fn().mockResolvedValue(null),
    },
  };

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
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("triggerAiRecommendations", () => {
    it("should return the actionId for the generation process", async () => {
      const resourceId = "resourceId";
      const userId = "resourceId";
      const mockedActionId = "actionId";

      jest
        .spyOn(
          PromptManagerService.prototype,
          "generatePromptForBreakTheMonolith"
        )
        .mockReturnValue("some prompt result");

      const spyOnCreateUserActionByTypeWithInitialStep = jest
        .spyOn(
          UserActionService.prototype,
          "createUserActionByTypeWithInitialStep"
        )
        .mockResolvedValue({
          actionId: mockedActionId,
        } as unknown as UserAction);

      const result = await service.triggerAiRecommendations({
        resourceId,
        userId,
      });

      expect(result).toEqual(mockedActionId);
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

  describe("btmRecommendationModelChanges", () => {
    it("should return the no changes to apply to the model in order to break a resource into microservice when no recommendation is find", async () => {
      const resourceId = "resourceId";

      mockPrismaBtmResourceRecFindMany.mockResolvedValue([]);

      const result = await service.btmRecommendationModelChanges({
        resourceId,
      });

      const expectedResult: AiRecommendations = {
        newResources: [],
        copiedEntities: [],
      };

      expect(result).toStrictEqual(expectedResult);
      expect(mockPrismaBtmResourceRecFindMany).toHaveReturnedTimes(1);
    });

    it("should return the changes to apply to the model in order to break a resource into microservices", async () => {
      const originatingResourceId = "originalResourceId";

      const recommendations: BtmResourceRecommendation & {
        btmEntityRecommendation: BtmEntityRecommendation[];
      } = {
        id: "resourceRecId",
        name: "newSuperCoolService",
        description: "description",
        resourceId: originatingResourceId,
        createdAt: new Date(),
        updatedAt: new Date(),
        btmEntityRecommendation: [
          {
            id: "id",
            name: "order",
            originalEntityId: "originalOrderEntityId",
            fields: ["id", "customer", "item", "address"],
            btmResourceRecommendationId: "resourceRecId",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "id",
            name: "customer",
            originalEntityId: "originalCustomerEntityId",
            fields: ["id", "firstName", "lastName", "address"],
            btmResourceRecommendationId: "resourceRecId",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };
      mockPrismaBtmResourceRecFindMany.mockResolvedValue([recommendations]);

      const result = await service.btmRecommendationModelChanges({
        resourceId: originatingResourceId,
      });

      const expectedResult: AiRecommendations = {
        newResources: [
          {
            id: "resourceRecId",
            name: "newSuperCoolService",
          },
        ],
        copiedEntities: [
          {
            entityId: "originalOrderEntityId",
            name: "order",
            originalResourceId: originatingResourceId,
            targetResourceId: "resourceRecId",
          },
          {
            entityId: "originalCustomerEntityId",
            name: "customer",
            originalResourceId: originatingResourceId,
            targetResourceId: "resourceRecId",
          },
        ],
      };

      expect(result).toStrictEqual(expectedResult);
      expect(mockPrismaBtmResourceRecFindMany).toHaveBeenCalledWith({
        where: {
          resourceId: originatingResourceId,
        },
        include: {
          btmEntityRecommendation: true,
        },
      });
    });
  });
});
