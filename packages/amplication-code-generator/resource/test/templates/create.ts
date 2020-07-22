import { INestApplication } from "@nestjs/common";
import { OpenApiValidator } from "express-openapi-validate";
import request from "supertest";

declare const app: INestApplication;
declare const validator: OpenApiValidator;
declare const PATHNAME: string;
declare const STATUS_CODE: string;
declare interface BODY_TYPE {}
declare interface ENTITY {}
declare const BODY: BODY_TYPE;
declare const CREATED_ENTITY: ENTITY;

const BODY_ID: BODY_TYPE = BODY;

const CREATED_ENTITY_ID: ENTITY = CREATED_ENTITY;

const service = {
  create() {
    return CREATED_ENTITY_ID;
  },
};

test(`POST ${PATHNAME}`, async () => {
  const validateResponse = validator.validateResponse("post", PATHNAME);
  const response = await request(app.getHttpServer())
    .post(PATHNAME)
    .send(BODY_ID)
    .expect(STATUS_CODE)
    .expect(CREATED_ENTITY_ID);
  expect(validateResponse(response)).toBe(undefined);
});
