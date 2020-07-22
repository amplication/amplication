import { INestApplication } from "@nestjs/common";
import { OpenApiValidator } from "express-openapi-validate";
import request from "supertest";

declare const app: INestApplication;
declare const validator: OpenApiValidator;
declare const PATHNAME: string;
declare const RESOURCE: string;
declare const STATUS: number;
declare const PARAM: string;
declare interface CONTENT_TYPE {}
declare const CONTENT: CONTENT_TYPE;
declare const EXISTING_PARAM_VALUE: any;
declare const NON_EXISTING_PARAM_VALUE: any;

const EXISTING_PARAM = EXISTING_PARAM_VALUE;
const NON_EXISTING_PARAM = NON_EXISTING_PARAM_VALUE;
const CONTENT_ID: CONTENT_TYPE = CONTENT;

const service = {
  findOne: ({ where }: { where: { id: string } }) => {
    switch (where.id) {
      case EXISTING_PARAM:
        return CONTENT_ID;
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
    .expect(CONTENT_ID);
  expect(validateResponse(response)).toBe(undefined);
});
