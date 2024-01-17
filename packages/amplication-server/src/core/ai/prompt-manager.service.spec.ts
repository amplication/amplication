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

  describe("generateResourcesFromPromptResult", () => {
    it("should return a BtmRecommendation", () => {
      const result = service.generateResourcesFromPromptResult(
        JSON.stringify({
          microservices: [
            {
              name: "microservice1",
              functionality: "functionality1",
              dataModels: [
                {
                  name: "dataModel1",
                  fields: [
                    {
                      name: "field1",
                    },
                  ],
                },
              ],
            },
          ],
        })
      );
      expect(result).toStrictEqual({
        actionId: "",
        resources: [
          {
            id: "",
            name: "microservice1",
            description: "functionality1",
            entities: [
              {
                id: "",
                name: "dataModel1",
                fields: ["field1"],
              },
            ],
          },
        ],
      });
    });

    it.each(["invalid", '{"microservice":{}}'])(
      "should throw an error if the prompt result is not valid",
      (result: string) => {
        expect(() =>
          service.generateResourcesFromPromptResult(result)
        ).toThrowError();
      }
    );
  });
});
