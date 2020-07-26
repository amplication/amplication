import { format } from "prettier";
import createTestModule from "./create-test";

const resource = "customers";
const entity = "customer";
const entityType = "Customer";
const entityServiceModule = `${entity}.service.ts`;
const entityModule = `${entity}.module.ts`;
const paths = {
  [`/${resource}`]: {
    get: {
      responses: {
        "200": {
          description: "A paged array of customers",
          headers: {
            "x-next": {
              description: "A link to the next page of responses",
              schema: { type: "string" },
            },
          },
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Customers" },
            },
          },
        },
        default: {
          description: "unexpected error",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
            },
          },
        },
      },
    },
  },
};
const api = {
  openapi: "3.0.0",
  info: {
    title: "Empty OpenAPI Object",
    version: "1.0.0",
  },
  paths,
  components: {
    schemas: {
      Customers: {
        type: "array",
        items: {
          type: "object",
          properties: {
            email: {
              type: "string",
              format: "email",
            },
          },
        },
        example: [
          {
            email: "alice@example.com",
          },
        ],
      },
      Error: {
        type: "object",
        required: ["statusCode", "message", "error"],
        additionalProperties: false,
        properties: {
          statusCode: { type: "integer" },
          message: { type: "string" },
          error: { type: "string" },
        },
      },
    },
  },
};

describe("createTestModule()", () => {
  test("simple", async () => {
    const module = await createTestModule(
      api,
      paths,
      resource,
      entity,
      entityType,
      entityServiceModule,
      entityModule
    );
    const expected = `
import { OpenApiValidator } from "express-openapi-validate";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import openApiDocument from "../api.json";
import request from "supertest";
import { CustomerModule } from "../customer.module";
import { CustomerService } from "../customer.service";

// Create the validator from the spec document
// @ts-ignore
const validator = new OpenApiValidator(openApiDocument, {});

const customers = [{ email: "alice@example.com" }];

const service = {
    findMany: () => customers
};

describe("Customer", () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
        imports: [CustomerModule],
        })
        .overrideProvider(CustomerService)
        .useValue(service)
        .compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    test("GET /customers", async () => {
        const validateResponse = validator.validateResponse("get", "/customers");
        const response = await request(app.getHttpServer())
        .get("/customers")
        .expect(200)
        .expect(customers);
        expect(validateResponse(response)).toBe(undefined);
    });
});`.trim();
    expect(format(module.code, { parser: "typescript" })).toBe(
      format(expected, { parser: "typescript" })
    );
  });
});
