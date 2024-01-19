import { Test } from "@nestjs/testing";
import { ResourceBtmService } from "./resourceBtm.service";
import { BreakTheMonolithPromptOutput } from "./resourceBtmPrompt.types";
import { EnumDataType } from "../../enums/EnumDataType";
import { BtmRecommendations } from "./dto/BtmRecommendations";
import { ResourcePartial } from "./resourceBtm.types";
import { AiService } from "../gpt/ai.service";
import { PrismaService } from "../../prisma";
import { UserActionService } from "../userAction/userAction.service";
import { ResourceBtmPromptService } from "./resourceBtmPrompt.service";

describe("ResourceBtmService", () => {
  let service: ResourceBtmService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResourceBtmService,
        {
          provide: AiService,
          useValue: {
            startConversation: jest.fn(),
            onConversationCompleted: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            resource: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: UserActionService,
          useValue: {},
        },
        ResourceBtmPromptService,
      ],
    }).compile();
    service = module.get<ResourceBtmService>(ResourceBtmService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("translateToBtmRecommendation", () => {
    it("should map the prompt result to a btm recommendation", () => {
      const promptResult: BreakTheMonolithPromptOutput = {
        microservices: [
          {
            name: "product",
            functionality: "manage products",
            dataModels: ["product"],
          },
          {
            name: "order",
            functionality: "manage orders, prices and payments",
            dataModels: ["order", "orderItem"],
          },
        ],
      };
      const originalResource: ResourcePartial = {
        name: "order",
        entities: [
          {
            id: "order",
            name: "order",
            displayName: "Order",
            versions: [
              {
                fields: [
                  {
                    name: "address",
                    displayName: "address",
                    dataType: EnumDataType.Lookup,
                    properties: {
                      relatedEntityId: "address",
                    },
                  },
                  {
                    name: "status",
                    displayName: "Status",
                    dataType: EnumDataType.Boolean,
                    properties: {},
                  },
                  {
                    name: "customer",
                    displayName: "Customer",
                    dataType: EnumDataType.Lookup,
                    properties: {
                      relatedEntityId: "customer",
                    },
                  },
                  {
                    name: "itemsId",
                    displayName: "ItemsId",
                    dataType: EnumDataType.SingleLineText,
                    properties: {},
                  },
                ],
              },
            ],
          },
          {
            id: "orderItem",
            name: "orderItem",
            displayName: "OrderItem",
            versions: [
              {
                fields: [
                  {
                    name: "order",
                    displayName: "Order",
                    dataType: EnumDataType.Lookup,
                    properties: {
                      relatedEntityId: "order",
                    },
                  },
                  {
                    name: "product",
                    displayName: "Product",
                    dataType: EnumDataType.Lookup,
                    properties: {
                      relatedEntityId: "product",
                    },
                  },
                  {
                    name: "quantity",
                    displayName: "Quantity",
                    dataType: EnumDataType.DecimalNumber,
                    properties: {},
                  },
                ],
              },
            ],
          },
          {
            id: "product",
            name: "product",
            displayName: "Product",
            versions: [
              {
                fields: [
                  {
                    name: "name",
                    displayName: "Name",
                    dataType: EnumDataType.SingleLineText,
                    properties: {},
                  },
                  {
                    name: "price",
                    displayName: "Price",
                    dataType: EnumDataType.DecimalNumber,
                    properties: {},
                  },
                ],
              },
            ],
          },
          {
            id: "customer",
            name: "customer",
            displayName: "Customer",
            versions: [
              {
                fields: [
                  {
                    name: "firstName",
                    displayName: "First Name",
                    dataType: EnumDataType.SingleLineText,
                    properties: {},
                  },
                  {
                    name: "lastName",
                    displayName: "Last Name",
                    dataType: EnumDataType.SingleLineText,
                    properties: {},
                  },
                ],
              },
            ],
          },
        ],
        id: "resourceId",
      };

      const expectedResult: BtmRecommendations = {
        microservices: [
          {
            id: expect.any(String),
            name: "order",
            description: "manage orders, prices and payments",
            entities: [
              {
                id: expect.any(String),
                name: "order",
                originalEntityId: "order",
                fields: ["address", "status", "customer", "itemsId"],
              },
              {
                id: expect.any(String),
                name: "orderItem",
                originalEntityId: "orderItem",
                fields: ["order", "product", "quantity"],
              },
            ],
          },
          {
            id: expect.any(String),
            name: "product",
            description: "manage products",
            entities: [
              {
                id: expect.any(String),
                name: "product",
                originalEntityId: "product",
                fields: ["name", "price"],
              },
            ],
          },
        ],
      };

      const result = service.translateToBtmRecommendation(
        promptResult,
        originalResource
      );

      expect(result).toStrictEqual(expectedResult);
    });

    it("should filter out entities that are not in the original resource", () => {
      const promptResult: BreakTheMonolithPromptOutput = {
        microservices: [
          {
            name: "product",
            functionality: "manage products",
            dataModels: ["product"],
          },
          {
            name: "order",
            functionality: "manage orders, prices and payments",
            dataModels: ["order", "orderItem"],
          },
        ],
      };
      const originalResource: ResourcePartial = {
        id: "resourceId",
        name: "order",
        entities: [
          {
            id: "order",
            name: "order",
            displayName: "Order",
            versions: [
              {
                fields: [
                  {
                    name: "address",
                    displayName: "address",
                    dataType: EnumDataType.Lookup,
                    properties: {
                      relatedEntityId: "address",
                    },
                  },
                  {
                    name: "status",
                    displayName: "Status",
                    dataType: EnumDataType.Boolean,
                    properties: {},
                  },
                  {
                    name: "customer",
                    displayName: "Customer",
                    dataType: EnumDataType.Lookup,
                    properties: {
                      relatedEntityId: "customer",
                    },
                  },
                  {
                    name: "itemsId",
                    displayName: "ItemsId",
                    dataType: EnumDataType.SingleLineText,
                    properties: {},
                  },
                ],
              },
            ],
          },
          {
            id: "orderItem",
            name: "orderItem",
            displayName: "OrderItem",
            versions: [
              {
                fields: [
                  {
                    name: "order",
                    displayName: "Order",
                    dataType: EnumDataType.Lookup,
                    properties: {
                      relatedEntityId: "order",
                    },
                  },
                  {
                    name: "product",
                    displayName: "Product",
                    dataType: EnumDataType.Lookup,
                    properties: {
                      relatedEntityId: "product",
                    },
                  },
                  {
                    name: "quantity",
                    displayName: "Quantity",
                    dataType: EnumDataType.DecimalNumber,
                    properties: {},
                  },
                ],
              },
            ],
          },
          {
            id: "product",
            name: "product",
            displayName: "Product",
            versions: [
              {
                fields: [
                  {
                    name: "name",
                    displayName: "Name",
                    dataType: EnumDataType.SingleLineText,
                    properties: {},
                  },
                  {
                    name: "price",
                    displayName: "Price",
                    dataType: EnumDataType.DecimalNumber,
                    properties: {},
                  },
                ],
              },
            ],
          },
          {
            id: "customer",
            name: "customer",
            displayName: "Customer",
            versions: [
              {
                fields: [
                  {
                    name: "firstName",
                    displayName: "First Name",
                    dataType: EnumDataType.SingleLineText,
                    properties: {},
                  },
                  {
                    name: "lastName",
                    displayName: "Last Name",
                    dataType: EnumDataType.SingleLineText,
                    properties: {},
                  },
                ],
              },
            ],
          },
        ],
      };

      const expectedResult: BtmRecommendations = {
        microservices: [
          {
            id: expect.any(String),
            name: "order",
            description: "manage orders, prices and payments",
            entities: [
              {
                id: expect.any(String),
                name: "order",
                originalEntityId: "order",
                fields: ["address", "status", "customer", "itemsId"],
              },
              {
                id: expect.any(String),
                name: "orderItem",
                originalEntityId: "orderItem",
                fields: ["order", "product", "quantity"],
              },
            ],
          },
          {
            id: expect.any(String),
            name: "product",
            description: "manage products",
            entities: [
              {
                id: expect.any(String),
                name: "product",
                originalEntityId: "product",
                fields: ["name", "price"],
              },
            ],
          },
        ],
      };

      const result = service.translateToBtmRecommendation(
        promptResult,
        originalResource
      );

      expect(result).toStrictEqual(expectedResult);
    });

    it("should add entities that are duplicated in the prompt result only to new resource with more dataModels", () => {
      const promptResult: BreakTheMonolithPromptOutput = {
        microservices: [
          {
            name: "product",
            functionality: "manage products",
            dataModels: ["product", "price"],
          },
          {
            name: "order",
            functionality: "manage orders, prices and payments",
            dataModels: ["order", "orderItem", "price"],
          },
        ],
      };

      const originalResource: ResourcePartial = {
        name: "order",
        id: "resourceId",
        entities: [
          {
            id: "order",
            name: "order",
            displayName: "Order",
            versions: [
              {
                fields: [
                  {
                    name: "id",
                    displayName: "id",
                    dataType: EnumDataType.SingleLineText,
                    properties: {},
                  },
                ],
              },
            ],
          },
          {
            id: "orderItem",
            name: "orderItem",
            displayName: "OrderItem",
            versions: [
              {
                fields: [
                  {
                    name: "id",
                    displayName: "id",
                    dataType: EnumDataType.DecimalNumber,
                    properties: {},
                  },
                ],
              },
            ],
          },
          {
            id: "product",
            name: "product",
            displayName: "Product",
            versions: [
              {
                fields: [
                  {
                    name: "name",
                    displayName: "Name",
                    dataType: EnumDataType.SingleLineText,
                    properties: {},
                  },
                ],
              },
            ],
          },
          {
            id: "price",
            name: "price",
            displayName: "price",
            versions: [
              {
                fields: [
                  {
                    name: "id",
                    displayName: "id",
                    dataType: EnumDataType.DecimalNumber,
                    properties: {},
                  },
                ],
              },
            ],
          },
        ],
      };

      const expectedResult: BtmRecommendations = {
        microservices: [
          {
            id: expect.any(String),
            name: "order",
            description: "manage orders, prices and payments",
            entities: [
              {
                id: expect.any(String),
                name: "order",
                originalEntityId: "order",
                fields: ["id"],
              },
              {
                id: expect.any(String),
                name: "orderItem",
                originalEntityId: "orderItem",
                fields: ["id"],
              },
              {
                id: expect.any(String),
                name: "price",
                originalEntityId: "price",
                fields: ["id"],
              },
            ],
          },
          {
            id: expect.any(String),
            name: "product",
            description: "manage products",
            entities: [
              {
                id: expect.any(String),
                name: "product",
                originalEntityId: "product",
                fields: ["name"],
              },
            ],
          },
        ],
      };

      const result = service.translateToBtmRecommendation(
        promptResult,
        originalResource
      );

      expect(result).toStrictEqual(expectedResult);
    });
  });

  describe("duplicatedEntities", () => {
    it("should return an empty array if there are no duplicated entities", () => {
      const result = service.duplicatedEntities(["a", "b", "c"]);

      expect(result).toStrictEqual(new Set([]));
    });

    it("should return the duplicated entities", () => {
      const result = service.duplicatedEntities(["a", "b", "c", "a", "b"]);

      expect(result).toStrictEqual(new Set(["a", "b"]));
    });
  });

  //   describe("triggerAiRecommendations", () => {
  //     it("should return the userAction for the generation process", async () => {
  //       const resourceId = "resourceId";
  //       const userId = "resourceId";
  //       const mockedActionId = "actionId";

  //       jest
  //         .spyOn(
  //           PromptManagerService.prototype,
  //           "generatePromptForBreakTheMonolith"
  //         )
  //         .mockReturnValue("some prompt result");

  //       const spyOnCreateUserActionByTypeWithInitialStep = jest
  //         .spyOn(
  //           UserActionService.prototype,
  //           "createUserActionByTypeWithInitialStep"
  //         )
  //         .mockResolvedValue({
  //           actionId: mockedActionId,
  //         } as unknown as UserAction);

  //       const result = await service.triggerAiRecommendations({
  //         resourceId,
  //         userId,
  //       });

  //       expect(result).toEqual(mockedActionId);
  //       expect(spyOnCreateUserActionByTypeWithInitialStep).toBeCalledWith(
  //         GENERATING_BTM_RESOURCE_RECOMMENDATION_USER_ACTION_TYPE,
  //         expect.objectContaining({
  //           resourceId,
  //           conversationTypeKey: "BREAK_THE_MONOLITH",
  //         }),
  //         expect.objectContaining({
  //           name: GENERATING_BTM_RESOURCE_RECOMMENDATION_STEP_NAME,
  //         }),
  //         resourceId,
  //         userId
  //       );
  //     });
  //   });

  //   describe("onConversationCompleted", () => {
  //     it.each([
  //       [EnumActionStepStatus.Success, true],
  //       [EnumActionStepStatus.Failed, false],
  //     ])(
  //       "should update the action status to %s when the conversion completion success is %s",
  //       async (expectedActionStatus, success) => {
  //         const result = success ? "A magic anwser" : null;
  //         const errorMessage = success ? null : "An error happened";
  //         const userActionId = "actionId";

  //         const actionStepToComplete = {
  //           id: "actionStepId",
  //         };

  //         mockPrismaUserActionFindFirst.mockResolvedValue({
  //           action: {
  //             steps: [actionStepToComplete],
  //           },
  //         } as unknown as UserAction);

  //         const res = await service.onConversationCompleted({
  //           userActionId,
  //           success,
  //           result,
  //           errorMessage,
  //         });

  //         expect(res).toBeTruthy();

  //         expect(mockPrismaUserActionFindFirst).toHaveBeenCalledTimes(1);
  //         expect(mockActionServiceComplete).toHaveBeenCalledWith(
  //           actionStepToComplete,
  //           expectedActionStatus
  //         );
  //       }
  //     );
  //   });
});
