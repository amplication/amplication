import { INestApplication } from "@nestjs/common";
import { OpenApiValidator } from "express-openapi-validate";
import request from "supertest";

declare const app: INestApplication;
declare const validator: OpenApiValidator;
declare const PATHNAME: string;
declare const STATUS: number;
declare interface CONTENT {}

const CONTENT_INSTANCE: CONTENT = [
  {
    id: faker.random.uuid(),
    email: faker.internet.email(),
    lastName: faker.name.lastName(),
    firstName: faker.name.firstName(),
  },
];

const service = {
  findMany: () => CONTENT_INSTANCE,
};

test(`GET ${PATHNAME}`, async () => {
  const validateResponse = validator.validateResponse("get", PATHNAME);
  const response = await request(app.getHttpServer())
    .get(PATHNAME)
    .expect(STATUS)
    .expect(CONTENT_INSTANCE);
  expect(validateResponse(response)).toBe(undefined);
});
