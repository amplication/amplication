import { Test } from "@nestjs/testing";
import { BtmManagerService } from "./btm-manager.service";
import {
  BreakTheMonolithPromptOutput,
  ResourcePartial,
} from "./prompt-manager.types";
import { EnumDataType } from "../../prisma";
import { BtmRecommendation } from "../../models/BtmRecommendation/BtmRecommendation";

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
