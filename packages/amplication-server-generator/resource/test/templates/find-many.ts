import { INestApplication } from "@nestjs/common";
import { OpenApiValidator } from "express-openapi-validate";
import request from "supertest";

declare const app: INestApplication;
declare const validator: OpenApiValidator;
declare const PATHNAME: string;
declare const STATUS: number;
declare interface CONTENT_TYPE {}
declare const CONTENT: CONTENT_TYPE;

const CONTENT_ID: CONTENT_TYPE = CONTENT;

const service = {
  findMany: () => CONTENT_ID,
};

test(`GET ${PATHNAME}`, async () => {
  const validateResponse = validator.validateResponse("get", PATHNAME);
  const response = await request(app.getHttpServer())
    .get(PATHNAME)
    .expect(STATUS)
    .expect(CONTENT_ID);
  expect(validateResponse(response)).toBe(undefined);
});
