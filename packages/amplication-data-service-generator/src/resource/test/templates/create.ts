import { INestApplication } from "@nestjs/common";
import { OpenApiValidator } from "express-openapi-validate";
import request from "supertest";

declare const app: INestApplication;
declare const validator: OpenApiValidator;
declare const PATHNAME: string;
declare const STATUS_CODE: string;
declare interface BODY_TYPE {}
declare interface CONTENT_TYPE {}
declare const BODY: BODY_TYPE;
declare const CONTENT: CONTENT_TYPE;

const BODY_ID: BODY_TYPE = BODY;

const CONTENT_ID: CONTENT_TYPE = CONTENT;

const service = {
  create() {
    return CONTENT_ID;
  },
};

test(`POST ${PATHNAME}`, async () => {
  const validateResponse = validator.validateResponse("post", PATHNAME);
  const response = await request(app.getHttpServer())
    .post(PATHNAME)
    .send(BODY_ID)
    .expect(STATUS_CODE)
    .expect(CONTENT_ID);
  expect(validateResponse(response)).toBe(undefined);
});
