import { Test } from "@nestjs/testing";
import { BtmManagerService } from "./btm-manager.service";
import {
  BreakTheMonolithPromptOutput,
  ResourcePartial,
} from "./prompt-manager.types";
import { EnumDataType } from "../../prisma";
import { BtmRecommendation } from "./dto";

describe("BtmManagerService", () => {
  let service: BtmManagerService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [BtmManagerService],
    }).compile();
    service = module.get<BtmManagerService>(BtmManagerService);
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
      };

      const expectedResult: BtmRecommendation = {
        actionId: "actionId",
        resources: [
          {
            id: undefined,
            name: "order",
            description: "manage orders, prices and payments",
            entities: [
              {
                id: undefined,
                name: "order",
                fields: ["address", "status", "customer", "itemsId"],
              },
              {
                id: undefined,
                name: "orderItem",
                fields: ["order", "product", "quantity"],
              },
            ],
          },
          {
            id: undefined,
            name: "product",
            description: "manage products",
            entities: [
              {
                id: undefined,
                name: "product",
                fields: ["name", "price"],
              },
            ],
          },
        ],
      };

      const result = service.translateToBtmRecommendation(
        "actionId",
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

      const expectedResult: BtmRecommendation = {
        actionId: "actionId",
        resources: [
          {
            id: undefined,
            name: "order",
            description: "manage orders, prices and payments",
            entities: [
              {
                id: undefined,
                name: "order",
                fields: ["address", "status", "customer", "itemsId"],
              },
              {
                id: undefined,
                name: "orderItem",
                fields: ["order", "product", "quantity"],
              },
            ],
          },
          {
            id: undefined,
            name: "product",
            description: "manage products",
            entities: [
              {
                id: undefined,
                name: "product",
                fields: ["name", "price"],
              },
            ],
          },
        ],
      };

      const result = service.translateToBtmRecommendation(
        "actionId",
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

      const expectedResult: BtmRecommendation = {
        actionId: "actionId",
        resources: [
          {
            id: undefined,
            name: "order",
            description: "manage orders, prices and payments",
            entities: [
              {
                id: undefined,
                name: "order",
                fields: ["id"],
              },
              {
                id: undefined,
                name: "orderItem",
                fields: ["id"],
              },
              {
                id: undefined,
                name: "price",
                fields: ["id"],
              },
            ],
          },
          {
            id: undefined,
            name: "product",
            description: "manage products",
            entities: [
              {
                id: undefined,
                name: "product",
                fields: ["name"],
              },
            ],
          },
        ],
      };

      const result = service.translateToBtmRecommendation(
        "actionId",
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
});
