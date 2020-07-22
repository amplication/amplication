/**
 * @see https://docs.nestjs.com/fundamentals/testing#end-to-end-testing
 * @see https://itnext.io/openapi-swagger-specifications-that-write-your-tests-for-you-sort-of-82276a491c68
 */

import { OpenApiValidator } from "express-openapi-validate";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";

// Load the OpenAPI document
import openApiDocument from "../api.json";

declare class MODULE {}
declare class SERVICE {}
declare const TEST_NAME: string;

// Create the validator from the spec document
// @ts-ignore
const validator = new OpenApiValidator(openApiDocument, {});

const service = {};

describe(TEST_NAME, () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [MODULE],
    })
      .overrideProvider(SERVICE)
      .useValue(service)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
});
