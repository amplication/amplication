import { Test } from "@nestjs/testing";
import { INestApplication, HttpStatus } from "@nestjs/common";
import request from "supertest";
import { CustomerModule } from "./customer.module";
import { CustomerService } from "./customer.service";

const nonExistingId = "nonExistingId";
const existingId = "existingId";
const customerCreateInput = {
  id: "exampleId",
  createdAt: new Date(),
  updatedAt: new Date(),
  email: "exampleEmail",
  firstName: "exampleFirstName",
  lastName: "exampleLastName",
};
const createResult = {
  id: "exampleId",
  createdAt: new Date(),
  updatedAt: new Date(),
  email: "exampleEmail",
  firstName: "exampleFirstName",
  lastName: "exampleLastName",
};
const findManyResult = [
  {
    id: "exampleId",
    createdAt: new Date(),
    updatedAt: new Date(),
    email: "exampleEmail",
    firstName: "exampleFirstName",
    lastName: "exampleLastName",
  },
];
const findOneResult = {
  id: "exampleId",
  createdAt: new Date(),
  updatedAt: new Date(),
  email: "exampleEmail",
  firstName: "exampleFirstName",
  lastName: "exampleLastName",
};

const service = {
  create() {
    return createResult;
  },
  findMany: () => findManyResult,
  findOne: ({ where }: { where: { id: string } }) => {
    switch (where.id) {
      case existingId:
        return findOneResult;
      case nonExistingId:
        return null;
    }
  },
};

describe("Customer", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CustomerModule],
    })
      .overrideProvider(CustomerService)
      .useValue(service)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  test("POST /customers", async () => {
    await request(app.getHttpServer())
      .post("/customers")
      .send(customerCreateInput)
      .expect(HttpStatus.CREATED)
      .expect(createResult);
  });

  test("GET /customers", async () => {
    await request(app.getHttpServer())
      .get("/customers")
      .expect(HttpStatus.OK)
      .expect(findManyResult);
  });

  test("GET /customers/:id non existing", async () => {
    await request(app.getHttpServer())
      .get(`/${"customers"}/${nonExistingId}`)
      .expect(404)
      .expect({
        statusCode: 404,
        message: `No resource was found for {"${"id"}":"${nonExistingId}"}`,
        error: "Not Found",
      });
  });

  test("GET /customers/:id existing", async () => {
    await request(app.getHttpServer())
      .get("/customers/existingId")
      .expect(HttpStatus.OK)
      .expect(findOneResult);
  });

  afterAll(async () => {
    await app.close();
  });
});
