import { INestApplication } from "@nestjs/common";
import { OpenApiValidator } from "express-openapi-validate";
import * as faker from "faker";
import request from "supertest";

declare const app: INestApplication;
declare const validator: OpenApiValidator;
declare const PATHNAME: string;
declare const RESOURCE: string;
declare const STATUS: number;
declare const PARAM: string;
declare interface CONTENT {}

const EXISTING_PARAM = faker.random.uuid();
const NON_EXISTING_PARAM = faker.random.uuid();
const CONTENT_INSTANCE: CONTENT = {
  id: EXISTING_PARAM,
  email: faker.internet.email(),
  lastName: faker.name.lastName(),
  firstName: faker.name.firstName(),
};

const service = {
  findOne: ({ where }: { where: { id: string } }) => {
    switch (where.id) {
      case EXISTING_PARAM:
        return CONTENT_INSTANCE;
      case NON_EXISTING_PARAM:
        return null;
    }
  },
};

test(`GET ${PATHNAME} non existing`, async () => {
  const validateResponse = validator.validateResponse("get", PATHNAME);
  const response = await request(app.getHttpServer())
    .get(`/${RESOURCE}/${NON_EXISTING_PARAM}`)
    .expect(404)
    .expect({
      statusCode: 404,
      message: `No resource was found for {"${PARAM}":"${NON_EXISTING_PARAM}"}`,
      error: "Not Found",
    });
  expect(validateResponse(response)).toBe(undefined);
});

test(`GET ${PATHNAME} existing`, async () => {
  const validateResponse = validator.validateResponse("get", PATHNAME);
  const response = await request(app.getHttpServer())
    .get(`/${RESOURCE}/${NON_EXISTING_PARAM}`)
    .expect(STATUS)
    .expect(CONTENT_INSTANCE);
  expect(validateResponse(response)).toBe(undefined);
});
