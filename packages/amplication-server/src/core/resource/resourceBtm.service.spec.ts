import { Test } from "@nestjs/testing";
import { ResourceBtmService } from "./resourceBtm.service";
import { BreakTheMonolithOutput } from "./resourceBtm.types";
import { EnumDataType } from "../../enums/EnumDataType";
import { ResourceDataForBtm } from "./resourceBtm.types";
import { GptService } from "../gpt/gpt.service";
import { PrismaService } from "../../prisma";
import { UserActionService } from "../userAction/userAction.service";
import { UserAction } from "../userAction/dto";
import { EnumUserActionType } from "../userAction/types";
import { ConversationTypeKey } from "../gpt/gpt.types";
import { BreakServiceToMicroservicesData } from "./dto/BreakServiceToMicroservicesResult";

const resourceIdMock = "resourceId";
const userIdMock = "userId";
const userActionIdMock = "userActionId";
const actionIdMock = "actionId";

const userActionMock = {
  id: userActionIdMock,
  resourceId: resourceIdMock,
  userId: userIdMock,
  userActionType: EnumUserActionType.GptConversation,
  actionId: actionIdMock,
} as unknown as UserAction;

const startConversationMock = jest.fn(() => Promise.resolve(userActionMock));
const userActionServiceFindOneMock = jest.fn(() =>
  Promise.resolve(userActionMock)
);

describe("ResourceBtmService", () => {
  let service: ResourceBtmService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResourceBtmService,
        {
          provide: GptService,
          useValue: {
            startConversation: startConversationMock,
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
          useValue: {
            findOne: userActionServiceFindOneMock,
          },
        },
      ],
    }).compile();
    service = module.get<ResourceBtmService>(ResourceBtmService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("translateToBtmRecommendation", () => {
    it("should map the prompt result to a btm recommendation", async () => {
      const promptResult: BreakTheMonolithOutput = {
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
      const originalResource: ResourceDataForBtm = {
        name: "order",
        id: resourceIdMock,
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

      jest
        .spyOn(service, "getResourceDataForBtm")
        .mockResolvedValue(originalResource);

      const expectedResult: BreakServiceToMicroservicesData = {
        microservices: [
          {
            name: "order",
            functionality: "manage orders, prices and payments",
            dataModels: [
              {
                name: "order",
                originalEntityId: "order",
              },
              {
                name: "orderItem",
                originalEntityId: "orderItem",
              },
            ],
          },
          {
            name: "product",
            functionality: "manage products",
            dataModels: [
              {
                name: "product",
                originalEntityId: "product",
              },
            ],
          },
        ],
      };

      const result = await service.prepareBtmRecommendations(
        JSON.stringify(promptResult),
        resourceIdMock
      );

      expect(result).toStrictEqual(expectedResult);
    });

    it("should filter out entities that are not in the original resource", async () => {
      const promptResult: BreakTheMonolithOutput = {
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
      const originalResource: ResourceDataForBtm = {
        id: resourceIdMock,
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

      jest
        .spyOn(service, "getResourceDataForBtm")
        .mockResolvedValue(originalResource);

      const expectedResult: BreakServiceToMicroservicesData = {
        microservices: [
          {
            name: "order",
            functionality: "manage orders, prices and payments",
            dataModels: [
              {
                name: "order",
                originalEntityId: "order",
              },
              {
                name: "orderItem",
                originalEntityId: "orderItem",
              },
            ],
          },
          {
            name: "product",
            functionality: "manage products",
            dataModels: [
              {
                name: "product",
                originalEntityId: "product",
              },
            ],
          },
        ],
      };

      const result = await service.prepareBtmRecommendations(
        JSON.stringify(promptResult),
        resourceIdMock
      );

      expect(result).toStrictEqual(expectedResult);
    });

    it("should add entities that are duplicated in the prompt result only to new resource with more dataModels", async () => {
      const promptResult: BreakTheMonolithOutput = {
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

      const originalResource: ResourceDataForBtm = {
        name: "order",
        id: resourceIdMock,
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

      jest
        .spyOn(service, "getResourceDataForBtm")
        .mockResolvedValue(originalResource);

      const expectedResult: BreakServiceToMicroservicesData = {
        microservices: [
          {
            name: "order",
            functionality: "manage orders, prices and payments",
            dataModels: [
              {
                name: "order",
                originalEntityId: "order",
              },
              {
                name: "orderItem",
                originalEntityId: "orderItem",
              },
              {
                name: "price",
                originalEntityId: "price",
              },
            ],
          },
          {
            name: "product",
            functionality: "manage products",
            dataModels: [
              {
                name: "product",
                originalEntityId: "product",
              },
            ],
          },
        ],
      };

      const result = await service.prepareBtmRecommendations(
        JSON.stringify(promptResult),
        resourceIdMock
      );

      expect(result).toStrictEqual(expectedResult);
    });
  });

  describe("findDuplicatedEntities", () => {
    it("should return an empty array if there are no duplicated entities", () => {
      const result = service.findDuplicatedEntities(["a", "b", "c"]);

      expect(result).toStrictEqual(new Set([]));
    });

    it("should return the duplicated entities", () => {
      const result = service.findDuplicatedEntities(["a", "b", "c", "a", "b"]);

      expect(result).toStrictEqual(new Set(["a", "b"]));
    });
  });

  describe("generatePromptForBreakTheMonolith", () => {
    it("should return a prompt", () => {
      const result = service.generatePromptForBreakTheMonolith({
        name: "ecommerce",
        id: "ecommerce-id",
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
                  {
                    name: "email",
                    displayName: "Email",
                    dataType: EnumDataType.SingleLineText,
                    properties: {},
                  },
                  {
                    name: "address",
                    displayName: "Address",
                    dataType: EnumDataType.Lookup,
                    properties: {
                      relatedEntityId: "address",
                    },
                  },
                ],
              },
            ],
          },
          {
            id: "item",
            name: "item",
            displayName: "Item",
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
                    dataType: EnumDataType.WholeNumber,
                    properties: {},
                  },
                  {
                    name: "description",
                    displayName: "Description",
                    dataType: EnumDataType.MultiLineText,
                    properties: {},
                  },
                ],
              },
            ],
          },
          {
            id: "address",
            name: "address",
            displayName: "Address",
            versions: [
              {
                fields: [
                  {
                    name: "street",
                    displayName: "Street",
                    dataType: EnumDataType.SingleLineText,
                    properties: {},
                  },
                  {
                    name: "city",
                    displayName: "City",
                    dataType: EnumDataType.SingleLineText,
                    properties: {},
                  },
                  {
                    name: "state",
                    displayName: "State",
                    dataType: EnumDataType.SingleLineText,
                    properties: {},
                  },
                  {
                    name: "zip",
                    displayName: "Zip",
                    dataType: EnumDataType.SingleLineText,
                    properties: {},
                  },
                ],
              },
            ],
          },
        ],
      });
      expect(JSON.parse(result)).toStrictEqual({
        dataModels: [
          {
            fields: [
              {
                dataType: "address",
                name: "address",
              },
              {
                dataType: "bool",
                name: "status",
              },
              {
                dataType: "customer",
                name: "customer",
              },
              {
                dataType: "string",
                name: "itemsId",
              },
            ],
            name: "order",
          },
          {
            fields: [
              {
                dataType: "string",
                name: "firstName",
              },
              {
                dataType: "string",
                name: "lastName",
              },
              {
                dataType: "string",
                name: "email",
              },
              {
                dataType: "address",
                name: "address",
              },
            ],
            name: "customer",
          },
          {
            fields: [
              {
                dataType: "string",
                name: "name",
              },
              {
                dataType: "int",
                name: "price",
              },
              {
                dataType: "string",
                name: "description",
              },
            ],
            name: "item",
          },
          {
            name: "address",
            fields: [
              {
                dataType: "string",
                name: "street",
              },
              {
                dataType: "string",
                name: "city",
              },
              {
                dataType: "string",
                name: "state",
              },
              {
                dataType: "string",
                name: "zip",
              },
            ],
          },
        ],
      });
    });
  });

  describe("parsePromptResult", () => {
    it("should return a validated BreakTheMonolithOutput", () => {
      const result = service.mapToBreakTheMonolithOutput(
        '{"microservices":[{"name":"ecommerce","functionality":"manage orders, prices and payments","dataModels":["order","customer","item","address"]},{"name":"inventory","functionality":"manage inventory","dataModels":["item","address"]}]}'
      );
      expect(result).toStrictEqual({
        microservices: [
          {
            name: "ecommerce",
            functionality: "manage orders, prices and payments",
            dataModels: ["order", "customer", "item", "address"],
          },
          {
            name: "inventory",
            functionality: "manage inventory",
            dataModels: ["item", "address"],
          },
        ],
      });
    });

    it.each(["invalid", '{"microservice":{}}'])(
      "should throw an error if the prompt result is not valid",
      (result: string) => {
        expect(() =>
          service.mapToBreakTheMonolithOutput(result)
        ).toThrowError();
      }
    );
  });

  describe("triggerBreakServiceIntoMicroservices", () => {
    const mockPromptResult = "prompt-result";
    it("should start a conversation with the GPT service", async () => {
      jest
        .spyOn(service, "getResourceDataForBtm")
        .mockResolvedValue({ id: resourceIdMock } as ResourceDataForBtm);

      jest
        .spyOn(service, "generatePromptForBreakTheMonolith")
        .mockReturnValue(mockPromptResult);

      const result = await service.triggerBreakServiceIntoMicroservices({
        resourceId: resourceIdMock,
        userId: userIdMock,
      });

      expect(startConversationMock).toHaveBeenCalledTimes(1);
      expect(startConversationMock).toHaveBeenCalledWith(
        ConversationTypeKey.BreakTheMonolith,
        [
          {
            name: "userInput",
            value: mockPromptResult,
          },
        ],
        userIdMock,
        resourceIdMock
      );

      expect(result).toStrictEqual(userActionMock);
    });
  });
});
