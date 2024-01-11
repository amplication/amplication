import { HealthController } from "../src/core/health/health.controller";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("HealthController", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`GET /_health/live should return empty response`, () => {
    return request(app.getHttpServer()).get("/_health/live").expect(204);
  });

  afterAll(async () => {
    await app.close();
  });
});
