import { Test } from "@nestjs/testing";
import { ResourceBtmService } from "./resourceBtm.service";
import { EnumDataType } from "../../enums/EnumDataType";
import {
  BreakTheMonolithOutput,
  ResourceDataForBtm,
} from "./resourceBtm.types";
import { GptService } from "../gpt/gpt.service";
import { PrismaService } from "../../prisma";
import { UserActionService } from "../userAction/userAction.service";
import { UserAction } from "../userAction/dto";
import { EnumUserActionType } from "../userAction/types";
import { ConversationTypeKey } from "../gpt/gpt.types";
import { BreakServiceToMicroservicesData } from "./dto/BreakServiceToMicroservicesResult";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { Resource, User, Workspace } from "../../models";
import { BillingService } from "../billing/billing.service";
import { EnumSubscriptionPlan } from "../subscription/dto";
import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalytics.types";
import { MockedSegmentAnalyticsProvider } from "../../services/segmentAnalytics/tests";
import { BooleanEntitlement, MeteredEntitlement } from "@stigg/node-server-sdk";
import { BillingFeature } from "@amplication/util-billing-types";
import { BillingLimitationError } from "../../errors/BillingLimitationError";
import { ServiceSettingsService } from "../serviceSettings/serviceSettings.service";

const resourceIdMock = "resourceId";
const userIdMock = "userId";
const userActionIdMock = "userActionId";
const actionIdMock = "actionId";
const workspaceIdMock = "workspaceId";
const projectIdMock = "projectId";

const userMock: User = {
  id: userIdMock,
  workspace: {
    id: workspaceIdMock,
  },
  account: {
    id: "accountId",
  },
} as User;

const resourceMock: Resource = {
  id: resourceIdMock,
  name: "resourceName",
  project: {
    id: projectIdMock,
  },
} as unknown as Resource;

const userActionMock = {
  id: userActionIdMock,
  resourceId: resourceIdMock,
  userId: userIdMock,
  userActionType: EnumUserActionType.GptConversation,
  actionId: actionIdMock,
} as unknown as UserAction;

const workspaceMock: Workspace = {
  id: workspaceIdMock,
  name: "Example Other Workspace",
  createdAt: new Date(),
  updatedAt: new Date(),
  allowLLMFeatures: true,
};

const startConversationMock = jest.fn();
const userActionServiceFindOneMock = jest.fn();
const resourceFindUniqueMock = jest.fn();
const resourceFindManyMock = jest.fn();
const serviceSettingsMock = {
  getServiceSettingsValues: jest.fn(() => {
    return {};
  }),
};

const workspaceFindUniqueMock = jest.fn();

const billingServiceIsBillingEnabledMock = jest.fn();
const getSubscriptionMock = jest.fn();
const billingServiceMock = {
  getSubscription: getSubscriptionMock,
  getMeteredEntitlement: jest.fn(() => {
    return {
      usageLimit: undefined,
    } as unknown as MeteredEntitlement;
  }),
  getNumericEntitlement: jest.fn(() => {
    return {};
  }),
  getBooleanEntitlement: jest.fn(() => {
    return {};
  }),
  reportUsage: jest.fn(() => {
    return {};
  }),
  provisionCustomer: jest.fn(() => {
    return {};
  }),
};
// This is important to mock the getter!!!
Object.defineProperty(billingServiceMock, "isBillingEnabled", {
  get: billingServiceIsBillingEnabledMock,
});

const trackMock = jest.fn();

describe("ResourceBtmService", () => {
  let service: ResourceBtmService;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
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
            workspace: {
              findUnique: workspaceFindUniqueMock,
            },
            resource: {
              findUnique: resourceFindUniqueMock,
              findMany: resourceFindManyMock,
            },
          },
        },
        {
          provide: UserActionService,
          useValue: {
            findOne: userActionServiceFindOneMock,
          },
        },
        {
          provide: ServiceSettingsService,
          useValue: serviceSettingsMock,
        },
        MockedSegmentAnalyticsProvider({
          trackWithContextMock: trackMock,
        }),
        {
          provide: BillingService,
          useValue: billingServiceMock,
        },
        MockedAmplicationLoggerProvider,
      ],
    }).compile();
    service = module.get<ResourceBtmService>(ResourceBtmService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should send analytics event for start redesign", async () => {
    getSubscriptionMock.mockResolvedValue({
      subscriptionPlan: EnumSubscriptionPlan.Enterprise,
    });

    resourceFindUniqueMock.mockResolvedValue(resourceMock);

    await service.startRedesign(userMock, resourceMock.id);

    expect(getSubscriptionMock).toHaveBeenCalledTimes(1);
    expect(getSubscriptionMock).toHaveBeenCalledWith(userMock.workspace.id);
    expect(trackMock).toHaveBeenCalledTimes(1);
    expect(trackMock).toHaveBeenCalledWith({
      properties: {
        projectId: resourceMock.project.id,
        resourceId: resourceMock.id,
        serviceName: resourceMock.name,
        plan: EnumSubscriptionPlan.Enterprise,
      },
      event: EnumEventType.ArchitectureRedesignStartRedesign,
    });
  });

  describe("prepareBtmRecommendations", () => {
    it("should map the prompt result to a btm recommendation", async () => {
      const promptResult: BreakTheMonolithOutput = {
        microservices: [
          {
            name: "product",
            functionality: "manage products",
            tables: ["product"],
          },
          {
            name: "order",
            functionality: "manage orders, prices and payments",
            tables: ["order", "orderItem"],
          },
          {
            name: "customer",
            functionality: "manage customer",
            tables: ["customer"],
          },
        ],
      };
      const originalResource: ResourceDataForBtm = {
        name: "order",
        project: resourceMock.project,
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

      resourceFindManyMock.mockResolvedValueOnce([resourceMock]);

      const expectedResult: BreakServiceToMicroservicesData = {
        microservices: [
          {
            name: "product",
            functionality: "manage products",
            tables: [
              {
                name: "product",
                originalEntityId: "product",
              },
            ],
          },
          {
            name: "customer",
            functionality: "manage customer",
            tables: [
              {
                name: "customer",
                originalEntityId: "customer",
              },
            ],
          },
          {
            name: "order",
            functionality: "manage orders, prices and payments",
            tables: [
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
        ],
      };

      const result = await service.prepareBtmRecommendations(
        JSON.stringify(promptResult),
        resourceIdMock,
        userMock
      );

      expect(result).toStrictEqual(expectedResult);
    });

    it("should filter out entities that are not in the original resource", async () => {
      const promptResult: BreakTheMonolithOutput = {
        microservices: [
          {
            name: "product",
            functionality: "manage products",
            tables: ["product"],
          },
          {
            name: "order",
            functionality: "manage orders, prices and payments",
            tables: ["order", "orderItem"],
          },
          {
            name: "customer",
            functionality: "manage customer",
            tables: ["customer"],
          },
        ],
      };

      const originalResource: ResourceDataForBtm = {
        id: resourceIdMock,
        name: "order",
        project: resourceMock.project,
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

      resourceFindManyMock.mockResolvedValueOnce([resourceMock]);

      const expectedResult: BreakServiceToMicroservicesData = {
        microservices: [
          {
            name: "product",
            functionality: "manage products",
            tables: [
              {
                name: "product",
                originalEntityId: "product",
              },
            ],
          },
          {
            name: "customer",
            functionality: "manage customer",
            tables: [
              {
                name: "customer",
                originalEntityId: "customer",
              },
            ],
          },
          {
            name: "order",
            functionality: "manage orders, prices and payments",
            tables: [
              {
                name: "order",
                originalEntityId: "order",
              },
            ],
          },
        ],
      };

      const result = await service.prepareBtmRecommendations(
        JSON.stringify(promptResult),
        resourceIdMock,
        userMock
      );

      expect(result).toStrictEqual(expectedResult);
    });

    it("should add entities that are duplicated in the prompt result only to new resource with least amount of tables", async () => {
      const promptResult: BreakTheMonolithOutput = {
        microservices: [
          {
            name: "product",
            functionality: "manage products",
            tables: ["product", "price"],
          },
          {
            name: "order",
            functionality: "manage orders, prices and payments",
            tables: ["order", "orderItem", "price"],
          },
        ],
      };

      const originalResource: ResourceDataForBtm = {
        name: "order",
        project: resourceMock.project,
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

      resourceFindManyMock.mockResolvedValueOnce([resourceMock]);

      const expectedResult: BreakServiceToMicroservicesData = {
        microservices: [
          {
            name: "product",
            functionality: "manage products",
            tables: [
              {
                name: "product",
                originalEntityId: "product",
              },
              {
                name: "price",
                originalEntityId: "price",
              },
            ],
          },
          {
            name: "order",
            functionality: "manage orders, prices and payments",
            tables: [
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
        ],
      };

      const result = await service.prepareBtmRecommendations(
        JSON.stringify(promptResult),
        resourceIdMock,
        userMock
      );

      expect(result).toStrictEqual(expectedResult);
    });

    it("should filter out services without data models", async () => {
      const promptResult: BreakTheMonolithOutput = {
        microservices: [
          {
            name: "product",
            functionality: "manage products",
            tables: ["product", "customer"],
          },
          {
            name: "order",
            functionality: "manage orders, prices and payments",
            tables: ["order", "orderItem"],
          },
          {
            name: "customer",
            functionality: "manage customers",
            tables: [],
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

      resourceFindManyMock.mockResolvedValueOnce([resourceMock]);

      const expectedResult: BreakServiceToMicroservicesData = {
        microservices: [
          {
            name: "product",
            functionality: "manage products",
            tables: [
              {
                name: "product",
                originalEntityId: "product",
              },
              {
                name: "customer",
                originalEntityId: "customer",
              },
            ],
          },
          {
            name: "order",
            functionality: "manage orders, prices and payments",
            tables: [
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
        ],
      };

      const result = await service.prepareBtmRecommendations(
        JSON.stringify(promptResult),
        resourceIdMock,
        userMock
      );

      expect(result).toStrictEqual(expectedResult);
    });

    it("should rename service name from gpt recommendation if it already exists in the project services", async () => {
      const promptResult: BreakTheMonolithOutput = {
        microservices: [
          {
            name: "product",
            functionality: "manage products",
            tables: ["product"],
          },
          {
            name: "order",
            functionality: "manage orders, prices and payments",
            tables: ["order", "orderItem"],
          },
          {
            name: "customer",
            functionality: "manage customer",
            tables: ["customer"],
          },
        ],
      };
      const originalResource: ResourceDataForBtm = {
        name: "order",
        project: resourceMock.project,
        id: "orderServiceId",
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

      resourceFindManyMock.mockResolvedValueOnce([
        resourceMock,
        {
          ...resourceMock,
          id: "productServiceId",
          name: "product",
        },
        {
          ...resourceMock,
          id: "orderServiceId",
          name: "order", // the original service
        },
      ]);

      const expectedResult: BreakServiceToMicroservicesData = {
        microservices: [
          {
            name: expect.stringMatching(/^product_[a-z0-9]{8}$/),
            functionality: "manage products",
            tables: [
              {
                name: "product",
                originalEntityId: "product",
              },
            ],
          },
          {
            name: "customer",
            functionality: "manage customer",
            tables: [
              {
                name: "customer",
                originalEntityId: "customer",
              },
            ],
          },
          {
            name: expect.stringMatching(/^order_[a-z0-9]{8}$/),
            functionality: "manage orders, prices and payments",
            tables: [
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
        ],
      };

      const result = await service.prepareBtmRecommendations(
        JSON.stringify(promptResult),
        resourceIdMock,
        userMock
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
        tables: [
          { name: "order", relations: ["address", "customer"] },
          { name: "customer", relations: ["address"] },
          { name: "item", relations: [] },
          { name: "address", relations: [] },
        ],
      });
    });
  });

  describe("parsePromptResult", () => {
    it("should return a validated BreakTheMonolithOutput", () => {
      const result = service.mapToBreakTheMonolithOutput(
        '{"microservices":[{"name":"ecommerce","functionality":"manage orders, prices and payments","tables":["order","customer","item","address"]},{"name":"inventory","functionality":"manage inventory","tables":["item","address"]}]}'
      );
      expect(result).toStrictEqual({
        microservices: [
          {
            name: "ecommerce",
            functionality: "manage orders, prices and payments",
            tables: ["order", "customer", "item", "address"],
          },
          {
            name: "inventory",
            functionality: "manage inventory",
            tables: ["item", "address"],
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

  describe("BreakServiceIntoMicroservices", () => {
    const mockPromptResult = "prompt-result";

    describe("when billing is disabled", () => {
      beforeEach(() => {
        billingServiceIsBillingEnabledMock.mockReturnValue(false);
      });
      it("should start a conversation with the GPT service", async () => {
        jest
          .spyOn(service, "getResourceDataForBtm")
          .mockResolvedValue(resourceMock as ResourceDataForBtm);

        jest
          .spyOn(service, "generatePromptForBreakTheMonolith")
          .mockReturnValue(mockPromptResult);

        getSubscriptionMock.mockResolvedValue({
          subscriptionPlan: EnumSubscriptionPlan.Pro,
        });

        startConversationMock.mockResolvedValue(userActionMock);

        const result = await service.triggerBreakServiceIntoMicroservices({
          resourceId: resourceMock.id,
          user: userMock,
        });

        expect(getSubscriptionMock).toHaveBeenCalledTimes(1);
        expect(getSubscriptionMock).toHaveBeenCalledWith(userMock.workspace.id);
        expect(trackMock).toHaveBeenCalledTimes(1);
        expect(trackMock).toHaveBeenCalledWith({
          properties: {
            projectId: resourceMock.project.id,
            resourceId: resourceMock.id,
            serviceName: resourceMock.name,
            plan: EnumSubscriptionPlan.Pro,
          },
          event: EnumEventType.ArchitectureRedesignStartBreakTheMonolith,
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

        expect(billingServiceMock.getBooleanEntitlement).not.toHaveBeenCalled();
        expect(result).toStrictEqual(userActionMock);
      });
    });

    describe("when billing is enabled", () => {
      beforeEach(() => {
        billingServiceIsBillingEnabledMock.mockReturnValue(true);
        workspaceFindUniqueMock.mockReturnValue(workspaceMock);
      });

      it("should throw a billing limitation error when the user doesn't have the entitlement", async () => {
        billingServiceMock.getBooleanEntitlement.mockReturnValueOnce({
          hasAccess: false,
        } as unknown as BooleanEntitlement);

        jest
          .spyOn(service, "getResourceDataForBtm")
          .mockResolvedValue(resourceMock as ResourceDataForBtm);

        await expect(
          service.triggerBreakServiceIntoMicroservices({
            resourceId: resourceMock.id,
            user: userMock,
          })
        ).rejects.toThrowError(
          new BillingLimitationError(
            "Available as part of the Enterprise plan only.",
            BillingFeature.RedesignArchitecture
          )
        );
      });

      it("should throw an error when there are no data models in the service", async () => {
        billingServiceMock.getBooleanEntitlement.mockReturnValueOnce({
          hasAccess: true,
        } as unknown as BooleanEntitlement);

        jest
          .spyOn(service, "getResourceDataForBtm")
          .mockResolvedValue(resourceMock as ResourceDataForBtm);

        await expect(
          service.triggerBreakServiceIntoMicroservices({
            resourceId: resourceMock.id,
            user: userMock,
          })
        ).rejects.toThrowError();
      });
      it("should start a conversation with the GPT service", async () => {
        billingServiceMock.getBooleanEntitlement.mockReturnValueOnce({
          hasAccess: true,
        } as unknown as BooleanEntitlement);

        jest
          .spyOn(service, "getResourceDataForBtm")
          .mockResolvedValue(resourceMock as ResourceDataForBtm);

        jest
          .spyOn(service, "generatePromptForBreakTheMonolith")
          .mockReturnValue(mockPromptResult);

        getSubscriptionMock.mockResolvedValue({
          subscriptionPlan: EnumSubscriptionPlan.Pro,
        });

        startConversationMock.mockResolvedValue(userActionMock);

        const result = await service.triggerBreakServiceIntoMicroservices({
          resourceId: resourceMock.id,
          user: userMock,
        });

        expect(getSubscriptionMock).toHaveBeenCalledTimes(1);
        expect(getSubscriptionMock).toHaveBeenCalledWith(userMock.workspace.id);
        expect(trackMock).toHaveBeenCalledTimes(1);
        expect(trackMock).toHaveBeenCalledWith({
          properties: {
            projectId: resourceMock.project.id,
            resourceId: resourceMock.id,
            serviceName: resourceMock.name,
            plan: EnumSubscriptionPlan.Pro,
          },
          event: EnumEventType.ArchitectureRedesignStartBreakTheMonolith,
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
});
