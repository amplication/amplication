import { Test } from "@nestjs/testing";
import { INestApplication, HttpStatus } from "@nestjs/common";
import request from "supertest";
import { MorganModule } from "nest-morgan";
import { CustomerController } from "../customer.controller";
import { CustomerService } from "../customer.service";

const nonExistingId = "nonExistingId";
const existingId = "existingId";
const CREATE_INPUT = {
  id: "exampleId",
  createdAt: new Date(),
  updatedAt: new Date(),
  email: "exampleEmail",
  firstName: "exampleFirstName",
  lastName: "exampleLastName",
  isVip: "true",
  birthData: new Date(),
  averageSale: 42.42,
  favoriteNumber: 42,
  geoLocation: "exampleGeoLocation",
  comments: "exampleComments",
};
const CREATE_RESULT = {
  id: "exampleId",
  createdAt: new Date(),
  updatedAt: new Date(),
  email: "exampleEmail",
  firstName: "exampleFirstName",
  lastName: "exampleLastName",
  isVip: "true",
  birthData: new Date(),
  averageSale: 42.42,
  favoriteNumber: 42,
  geoLocation: "exampleGeoLocation",
  comments: "exampleComments",
};
const FIND_MANY_RESULT = [
  {
    id: "exampleId",
    createdAt: new Date(),
    updatedAt: new Date(),
    email: "exampleEmail",
    firstName: "exampleFirstName",
    lastName: "exampleLastName",
    isVip: "true",
    birthData: new Date(),
    averageSale: 42.42,
    favoriteNumber: 42,
    geoLocation: "exampleGeoLocation",
    comments: "exampleComments",
  },
];
const FIND_ONE_RESULT = {
  id: "exampleId",
  createdAt: new Date(),
  updatedAt: new Date(),
  email: "exampleEmail",
  firstName: "exampleFirstName",
  lastName: "exampleLastName",
  isVip: "true",
  birthData: new Date(),
  averageSale: 42.42,
  favoriteNumber: 42,
  geoLocation: "exampleGeoLocation",
  comments: "exampleComments",
};

const service = {
  create() {
    return CREATE_RESULT;
  },
  findMany: () => FIND_MANY_RESULT,
  findOne: ({ where }: { where: { id: string } }) => {
    switch (where.id) {
      case existingId:
        return FIND_ONE_RESULT;
      case nonExistingId:
        return null;
    }
  },
};

describe("Customer", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: CustomerService,
          useValue: service,
        },
      ],
      controllers: [CustomerController],
      imports: [MorganModule.forRoot()],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  test("POST /customers", async () => {
    await request(app.getHttpServer())
      .post("/customers")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        createdAt: CREATE_RESULT.createdAt.toISOString(),
        updatedAt: CREATE_RESULT.updatedAt.toISOString(),
        birthData: CREATE_RESULT.birthData.toISOString(),
      });
  });

  test("GET /customers", async () => {
    await request(app.getHttpServer())
      .get("/customers")
      .expect(HttpStatus.OK)
      .expect([
        {
          ...FIND_MANY_RESULT[0],
          createdAt: FIND_MANY_RESULT[0].createdAt.toISOString(),
          updatedAt: FIND_MANY_RESULT[0].updatedAt.toISOString(),
          birthData: FIND_MANY_RESULT[0].birthData.toISOString(),
        },
      ]);
  });

  test("GET /customers/:id non existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/customers"}/${nonExistingId}`)
      .expect(HttpStatus.NOT_FOUND)
      .expect({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No resource was found for {"${"id"}":"${nonExistingId}"}`,
        error: "Not Found",
      });
  });

  test("GET /customers/:id existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/customers"}/${existingId}`)
      .expect(HttpStatus.OK)
      .expect({
        ...FIND_ONE_RESULT,
        createdAt: FIND_ONE_RESULT.createdAt.toISOString(),
        updatedAt: FIND_ONE_RESULT.updatedAt.toISOString(),
        birthData: FIND_ONE_RESULT.birthData.toISOString(),
      });
  });

  test("POST /customers existing resource", async () => {
    let agent = request(app.getHttpServer());
    await agent
      .post("/customers")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        createdAt: CREATE_RESULT.createdAt.toISOString(),
        updatedAt: CREATE_RESULT.updatedAt.toISOString(),
        birthData: CREATE_RESULT.birthData.toISOString(),
      })
      .then(function () {
        agent
          .post("/customers")
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
