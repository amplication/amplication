import { EnumDataType } from "../../prisma";
import { PromptManagerService } from "./prompt-manager.service";
import { Test } from "@nestjs/testing";

describe("PromptManagerService", () => {
  let service: PromptManagerService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [PromptManagerService],
    }).compile();
    service = module.get<PromptManagerService>(PromptManagerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("generatePromptForBreakTheMonolith", () => {
    it("should return a prompt", () => {
      const result = service.generatePromptForBreakTheMonolith({
        name: "ecommerce",
        entities: [
          {
            id: "order",
            name: "order",
            displayName: "Order",
            pluralDisplayName: "Orders",
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
                  },
                ],
              },
            ],
          },
          {
            id: "customer",
            name: "customer",
            displayName: "Customer",
            pluralDisplayName: "Customers",
            versions: [
              {
                fields: [
                  {
                    name: "firstName",
                    displayName: "First Name",
                    dataType: EnumDataType.SingleLineText,
                  },
                  {
                    name: "lastName",
                    displayName: "Last Name",
                    dataType: EnumDataType.SingleLineText,
                  },
                  {
                    name: "email",
                    displayName: "Email",
                    dataType: EnumDataType.SingleLineText,
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
            pluralDisplayName: "Items",
            versions: [
              {
                fields: [
                  {
                    name: "name",
                    displayName: "Name",
                    dataType: EnumDataType.SingleLineText,
                  },
                  {
                    name: "price",
                    displayName: "Price",
                    dataType: EnumDataType.WholeNumber,
                  },
                  {
                    name: "description",
                    displayName: "Description",
                    dataType: EnumDataType.MultiLineText,
                  },
                ],
              },
            ],
          },
          {
            id: "address",
            name: "address",
            displayName: "Address",
            pluralDisplayName: "Addresses",
            versions: [
              {
                fields: [
                  {
                    name: "street",
                    displayName: "Street",
                    dataType: EnumDataType.SingleLineText,
                  },
                  {
                    name: "city",
                    displayName: "City",
                    dataType: EnumDataType.SingleLineText,
                  },
                  {
                    name: "state",
                    displayName: "State",
                    dataType: EnumDataType.SingleLineText,
                  },
                  {
                    name: "zip",
                    displayName: "Zip",
                    dataType: EnumDataType.SingleLineText,
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
                dataType: "Boolean",
                name: "status",
              },
              {
                dataType: "customer",
                name: "customer",
              },
              {
                dataType: "SingleLineText",
                name: "itemsId",
              },
            ],
            name: "order",
          },
          {
            fields: [
              {
                dataType: "SingleLineText",
                name: "firstName",
              },
              {
                dataType: "SingleLineText",
                name: "lastName",
              },
              {
                dataType: "SingleLineText",
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
                dataType: "SingleLineText",
                name: "name",
              },
              {
                dataType: "WholeNumber",
                name: "price",
              },
              {
                dataType: "MultiLineText",
                name: "description",
              },
            ],
            name: "item",
          },
          {
            name: "address",
            fields: [
              {
                dataType: "SingleLineText",
                name: "street",
              },
              {
                dataType: "SingleLineText",
                name: "city",
              },
              {
                dataType: "SingleLineText",
                name: "state",
              },
              {
                dataType: "SingleLineText",
                name: "zip",
              },
            ],
          },
        ],
      });
    });
  });
});
