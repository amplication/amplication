import { Test } from "@nestjs/testing";
import { INestApplication, HttpStatus } from "@nestjs/common";
import request from "supertest";
import { MorganModule } from "nest-morgan";
import { UserController } from "../user.controller";
import { UserService } from "../user.service";

const nonExistingId = "nonExistingId";
const existingId = "existingId";
const CREATE_INPUT = {
  username: "exampleUsername",
  password: "examplePassword",
  id: "exampleId",
  name: "exampleName",
  bio: "exampleBio",
  email: "exampleEmail",
  age: 42,
  birthDate: new Date(),
  score: 42.42,
  isCurious: "true",
  location: "exampleLocation",
};
const CREATE_RESULT = {
  username: "exampleUsername",
  password: "examplePassword",
  id: "exampleId",
  name: "exampleName",
  bio: "exampleBio",
  email: "exampleEmail",
  age: 42,
  birthDate: new Date(),
  score: 42.42,
  isCurious: "true",
  location: "exampleLocation",
};
const FIND_MANY_RESULT = [
  {
    username: "exampleUsername",
    password: "examplePassword",
    id: "exampleId",
    name: "exampleName",
    bio: "exampleBio",
    email: "exampleEmail",
    age: 42,
    birthDate: new Date(),
    score: 42.42,
    isCurious: "true",
    location: "exampleLocation",
  },
];
const FIND_ONE_RESULT = {
  username: "exampleUsername",
  password: "examplePassword",
  id: "exampleId",
  name: "exampleName",
  bio: "exampleBio",
  email: "exampleEmail",
  age: 42,
  birthDate: new Date(),
  score: 42.42,
  isCurious: "true",
  location: "exampleLocation",
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

describe("User", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: service,
        },
      ],
      controllers: [UserController],
      imports: [MorganModule.forRoot()],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  test("POST /users", async () => {
    await request(app.getHttpServer())
      .post("/users")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        birthDate: CREATE_RESULT.birthDate.toISOString(),
      });
  });

  test("GET /users", async () => {
    await request(app.getHttpServer())
      .get("/users")
      .expect(HttpStatus.OK)
      .expect([
        {
          ...FIND_MANY_RESULT[0],
          birthDate: FIND_MANY_RESULT[0].birthDate.toISOString(),
        },
      ]);
  });

  test("GET /users/:id non existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/users"}/${nonExistingId}`)
      .expect(HttpStatus.NOT_FOUND)
      .expect({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No resource was found for {"${"id"}":"${nonExistingId}"}`,
        error: "Not Found",
      });
  });

  test("GET /users/:id existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/users"}/${existingId}`)
      .expect(HttpStatus.OK)
      .expect({
        ...FIND_ONE_RESULT,
        birthDate: FIND_ONE_RESULT.birthDate.toISOString(),
      });
  });

  test("POST /users existing resource", async () => {
    let agent = request(app.getHttpServer());
    await agent
      .post("/users")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        birthDate: CREATE_RESULT.birthDate.toISOString(),
      })
      .then(function () {
        agent
          .post("/users")
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
