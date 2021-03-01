/**
 * @see https://docs.nestjs.com/fundamentals/testing#end-to-end-testing
 */

import { Test } from "@nestjs/testing";
import { INestApplication, HttpStatus, ExecutionContext } from "@nestjs/common";
import request from "supertest";
import { MorganModule } from "nest-morgan";
import { ACGuard } from "nest-access-control";
// @ts-ignore
import { BasicAuthGuard } from "../../auth/basicAuth.guard";
// @ts-ignore
import { ACLModule } from "../../auth/acl.module";

// declare class MODULE {}
declare class CONTROLLER {}
declare class SERVICE {}
declare const TEST_NAME: string;
declare interface ENTITY_TYPE {
  createdAt: Date;
  updatedAt: Date;
}
declare const CREATE_PATHNAME: string;
declare interface CREATE_INPUT_TYPE {}
declare const CREATE_INPUT_VALUE: CREATE_INPUT_TYPE;
declare const CREATE_RESULT_VALUE: ENTITY_TYPE;
declare const CREATE_EXPECTED_RESULT: ENTITY_TYPE;
declare const FIND_MANY_PATHNAME: string;
declare const FIND_MANY_RESULT_VALUE: ENTITY_TYPE[];
declare const FIND_MANY_EXPECTED_RESULT: ENTITY_TYPE[];
declare const FIND_ONE_PATHNAME: string;
declare const RESOURCE: string;
declare interface FIND_ONE_PARAM {}
declare const NON_EXISTING_PARAM: FIND_ONE_PARAM;
declare const EXISTING_PARAM: FIND_ONE_PARAM;
declare const FIND_ONE_PARAM_NAME: string;
declare const FIND_ONE_RESULT_VALUE: ENTITY_TYPE;
declare const FIND_ONE_EXPECTED_RESULT: ENTITY_TYPE;

const NON_EXISTING_PARAM_ID = NON_EXISTING_PARAM;
const EXISTING_PARAM_ID = EXISTING_PARAM;
const CREATE_INPUT = CREATE_INPUT_VALUE;
const CREATE_RESULT = CREATE_RESULT_VALUE;
const FIND_MANY_RESULT = FIND_MANY_RESULT_VALUE;
const FIND_ONE_RESULT = FIND_ONE_RESULT_VALUE;

const service = {
  create() {
    return CREATE_RESULT;
  },
  findMany: () => FIND_MANY_RESULT,
  findOne: ({ where }: { where: { id: string } }) => {
    switch (where.id) {
      case EXISTING_PARAM_ID:
        return FIND_ONE_RESULT;
      case NON_EXISTING_PARAM_ID:
        return null;
    }
  },
};

const basicAuthGuard = {
  canActivate: (context: ExecutionContext) => {
    const argumentHost = context.switchToHttp();
    const request = argumentHost.getRequest();
    request.user = {
      roles: ["user"],
    };
    return true;
  },
};

const acGuard = {
  canActivate: () => {
    return true;
  },
};

describe(TEST_NAME, () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: SERVICE,
          useValue: service,
        },
      ],
      controllers: [CONTROLLER],
      imports: [MorganModule.forRoot(), ACLModule],
    })
      .overrideGuard(BasicAuthGuard)
      .useValue(basicAuthGuard)
      .overrideGuard(ACGuard)
      .useValue(acGuard)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  test(`POST ${CREATE_PATHNAME}`, async () => {
    await request(app.getHttpServer())
      .post(CREATE_PATHNAME)
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect(CREATE_EXPECTED_RESULT);
  });

  test(`GET ${FIND_MANY_PATHNAME}`, async () => {
    await request(app.getHttpServer())
      .get(FIND_MANY_PATHNAME)
      .expect(HttpStatus.OK)
      .expect(FIND_MANY_EXPECTED_RESULT);
  });

  test(`GET ${FIND_ONE_PATHNAME} non existing`, async () => {
    await request(app.getHttpServer())
      .get(`${RESOURCE}/${NON_EXISTING_PARAM_ID}`)
      .expect(404)
      .expect({
        statusCode: 404,
        message: `No resource was found for {"${FIND_ONE_PARAM_NAME}":"${NON_EXISTING_PARAM_ID}"}`,
        error: "Not Found",
      });
  });

  test(`GET ${FIND_ONE_PATHNAME} existing`, async () => {
    await request(app.getHttpServer())
      .get(`${RESOURCE}/${EXISTING_PARAM_ID}`)
      .expect(HttpStatus.OK)
      .expect(FIND_ONE_EXPECTED_RESULT);
  });

  afterAll(async () => {
    await app.close();
  });
});
