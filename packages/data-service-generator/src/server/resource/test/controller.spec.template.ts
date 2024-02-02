/**
 * @see https://docs.nestjs.com/fundamentals/testing#end-to-end-testing
 */

import { Test } from "@nestjs/testing";
import {
  INestApplication,
  HttpStatus,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import request from "supertest";
import { ACGuard } from "nest-access-control";
import { DefaultAuthGuard } from "../../auth/defaultAuth.guard";
import { ACLModule } from "../../auth/acl.module";
import { AclFilterResponseInterceptor } from "../../interceptors/aclFilterResponse.interceptor";
import { AclValidateRequestInterceptor } from "../../interceptors/aclValidateRequest.interceptor";
import { map } from "rxjs";

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
  CREATE_ENTITY_FUNCTION() {
    return CREATE_RESULT;
  },
  FIND_MANY_ENTITY_FUNCTION: () => FIND_MANY_RESULT,
  FIND_ONE_ENTITY_FUNCTION: ({ where }: { where: { id: string } }) => {
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

const aclFilterResponseInterceptor = {
  intercept: (context: ExecutionContext, next: CallHandler) => {
    return next.handle().pipe(
      map((data) => {
        return data;
      })
    );
  },
};
const aclValidateRequestInterceptor = {
  intercept: (context: ExecutionContext, next: CallHandler) => {
    return next.handle();
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
      imports: [ACLModule],
    })
      .overrideGuard(DefaultAuthGuard)
      .useValue(basicAuthGuard)
      .overrideGuard(ACGuard)
      .useValue(acGuard)
      .overrideInterceptor(AclFilterResponseInterceptor)
      .useValue(aclFilterResponseInterceptor)
      .overrideInterceptor(AclValidateRequestInterceptor)
      .useValue(aclValidateRequestInterceptor)
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
      .expect(HttpStatus.NOT_FOUND)
      .expect({
        statusCode: HttpStatus.NOT_FOUND,
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

  test(`POST ${CREATE_PATHNAME} existing resource`, async () => {
    const agent = request(app.getHttpServer());
    await agent
      .post(CREATE_PATHNAME)
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect(CREATE_EXPECTED_RESULT)
      .then(function () {
        agent
          .post(CREATE_PATHNAME)
          .send(CREATE_INPUT)
          .expect(HttpStatus.CONFLICT)
          .expect({
            statusCode: HttpStatus.CONFLICT,
          });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
