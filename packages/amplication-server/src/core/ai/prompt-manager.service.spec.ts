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
            displayName: "Order",
            fields: [
              {
                dataType: "address",
                displayName: "address",
                name: "address",
                relatedDataModel: "address",
              },
              {
                dataType: "Boolean",
                displayName: "Status",
                name: "status",
              },
              {
                dataType: "customer",
                displayName: "Customer",
                name: "customer",
                relatedDataModel: "customer",
              },
              {
                dataType: "SingleLineText",
                displayName: "ItemsId",
                name: "itemsId",
              },
            ],
            name: "order",
          },
          {
            displayName: "Customer",
            fields: [
              {
                dataType: "SingleLineText",
                displayName: "First Name",
                name: "firstName",
              },
              {
                dataType: "SingleLineText",
                displayName: "Last Name",
                name: "lastName",
              },
              {
                dataType: "SingleLineText",
                displayName: "Email",
                name: "email",
              },
              {
                dataType: "address",
                displayName: "Address",
                name: "address",
                relatedDataModel: "address",
              },
            ],
            name: "customer",
          },
          {
            displayName: "Item",
            fields: [
              {
                dataType: "SingleLineText",
                displayName: "Name",
                name: "name",
              },
              {
                dataType: "WholeNumber",
                displayName: "Price",
                name: "price",
              },
              {
                dataType: "MultiLineText",
                displayName: "Description",
                name: "description",
              },
            ],
            name: "item",
          },
          {
            name: "address",
            displayName: "Address",
            fields: [
              {
                dataType: "SingleLineText",
                displayName: "Street",
                name: "street",
              },
              {
                dataType: "SingleLineText",
                displayName: "City",
                name: "city",
              },
              {
                dataType: "SingleLineText",
                displayName: "State",
                name: "state",
              },
              {
                dataType: "SingleLineText",
                displayName: "Zip",
                name: "zip",
              },
            ],
          },
        ],
      });
    });
  });
});
