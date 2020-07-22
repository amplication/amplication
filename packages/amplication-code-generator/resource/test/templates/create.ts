import { INestApplication } from "@nestjs/common";
import { OpenApiValidator } from "express-openapi-validate";
import * as faker from "faker";
import request from "supertest";

declare const app: INestApplication;
declare const validator: OpenApiValidator;
declare const PATHNAME: string;
declare const STATUS_CODE: string;
declare interface BODY_TYPE {}
declare interface ENTITY {}

const BODY_TYPE_INSTANCE: BODY_TYPE = {
  email: faker.internet.email(),
  lastName: faker.name.lastName(),
  firstName: faker.name.firstName(),
};

const CREATED_ENTITY: ENTITY = {
  ...BODY_TYPE_INSTANCE,
  id: faker.random.uuid(),
};

const service = {
  create() {
    return CREATED_ENTITY;
  },
};

test(`POST ${PATHNAME}`, async () => {
  const validateResponse = validator.validateResponse("post", PATHNAME);
  const response = await request(app.getHttpServer())
    .post(PATHNAME)
    .send(BODY_TYPE_INSTANCE)
    .expect(STATUS_CODE)
    .expect(CREATED_ENTITY);
  expect(validateResponse(response)).toBe(undefined);
});
