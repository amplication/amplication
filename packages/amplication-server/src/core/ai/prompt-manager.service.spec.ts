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
        resourceName: "ecommerce",
        resourceDisplayName: "E-Commerce",
        entities: [
          {
            name: "order",
            displayName: "Order",
            fields: [
              {
                name: "address",
                displayName: "address",
                dataType: "Address",
              },
              {
                name: "status",
                displayName: "Status",
                dataType: "Status",
              },
              {
                name: "customer",
                displayName: "Customer",
                dataType: "Customer",
              },
              {
                name: "itemsId",
                displayName: "ItemsId",
                dataType: "string[]",
              },
            ],
          },
          {
            name: "customer",
            displayName: "Customer",
            fields: [
              {
                name: "firstName",
                displayName: "First Name",
                dataType: "string",
              },
              {
                name: "lastName",
                displayName: "Last Name",
                dataType: "string",
              },
              {
                name: "email",
                displayName: "Email",
                dataType: "string",
              },
              {
                name: "address",
                displayName: "Address",
                dataType: "Address",
              },
            ],
          },
          {
            name: "item",
            displayName: "Item",
            fields: [
              {
                name: "name",
                displayName: "Name",
                dataType: "string",
              },
              {
                name: "price",
                displayName: "Price",
                dataType: "number",
              },
              {
                name: "description",
                displayName: "Description",
                dataType: "string",
              },
            ],
          },
          {
            name: "address",
            displayName: "Address",
            fields: [
              {
                name: "street",
                displayName: "Street",
                dataType: "string",
              },
              {
                name: "city",
                displayName: "City",
                dataType: "string",
              },
              {
                name: "state",
                displayName: "State",
                dataType: "string",
              },
              {
                name: "zip",
                displayName: "Zip",
                dataType: "string",
              },
            ],
          },
          {
            name: "status",
            displayName: "Status",
            fields: [
              {
                name: "name",
                displayName: "Name",
                dataType: "string",
              },
              {
                name: "description",
                displayName: "Description",
                dataType: "string",
              },
            ],
          },
        ],
      });
      expect(result).toEqual(
        "model Order has the following fields:\n" +
          " - address (type:Address)\n" +
          " - Status (type:Status)\n" +
          " - Customer (type:Customer)\n" +
          " - ItemsId (type:string[])\n" +
          "model Customer has the following fields:\n" +
          " - First Name (type:string)\n" +
          " - Last Name (type:string)\n" +
          " - Email (type:string)\n" +
          " - Address (type:Address)\n" +
          "model Item has the following fields:\n" +
          " - Name (type:string)\n" +
          " - Price (type:number)\n" +
          " - Description (type:string)\n" +
          "model Address has the following fields:\n" +
          " - Street (type:string)\n" +
          " - City (type:string)\n" +
          " - State (type:string)\n" +
          " - Zip (type:string)\n" +
          "model Status has the following fields:\n" +
          " - Name (type:string)\n" +
          " - Description (type:string)"
      );
    });
  });
});
