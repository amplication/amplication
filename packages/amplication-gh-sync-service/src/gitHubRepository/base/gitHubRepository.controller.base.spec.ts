import { Test } from "@nestjs/testing";
import { INestApplication, HttpStatus, ExecutionContext } from "@nestjs/common";
import request from "supertest";
import { MorganModule } from "nest-morgan";
import { ACGuard } from "nest-access-control";
import { DefaultAuthGuard } from "../../auth/defaultAuth.guard";
import { ACLModule } from "../../auth/acl.module";
import { GitHubRepositoryController } from "../gitHubRepository.controller";
import { GitHubRepositoryService } from "../gitHubRepository.service";

const nonExistingId = "nonExistingId";
const existingId = "existingId";
const CREATE_INPUT = {
  id: "exampleId",
  createdAt: new Date(),
  updatedAt: new Date(),
  pushedAt: new Date(),
  provider: "exampleProvider",
  owner: "exampleOwner",
  branch: "exampleBranch",
  name: "exampleName",
};
const CREATE_RESULT = {
  id: "exampleId",
  createdAt: new Date(),
  updatedAt: new Date(),
  pushedAt: new Date(),
  provider: "exampleProvider",
  owner: "exampleOwner",
  branch: "exampleBranch",
  name: "exampleName",
};
const FIND_MANY_RESULT = [
  {
    id: "exampleId",
    createdAt: new Date(),
    updatedAt: new Date(),
    pushedAt: new Date(),
    provider: "exampleProvider",
    owner: "exampleOwner",
    branch: "exampleBranch",
    name: "exampleName",
  },
];
const FIND_ONE_RESULT = {
  id: "exampleId",
  createdAt: new Date(),
  updatedAt: new Date(),
  pushedAt: new Date(),
  provider: "exampleProvider",
  owner: "exampleOwner",
  branch: "exampleBranch",
  name: "exampleName",
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

describe("GitHubRepository", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: GitHubRepositoryService,
          useValue: service,
        },
      ],
      controllers: [GitHubRepositoryController],
      imports: [MorganModule.forRoot(), ACLModule],
    })
      .overrideGuard(DefaultAuthGuard)
      .useValue(basicAuthGuard)
      .overrideGuard(ACGuard)
      .useValue(acGuard)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  test("POST /gitHubRepositories", async () => {
    await request(app.getHttpServer())
      .post("/gitHubRepositories")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        createdAt: CREATE_RESULT.createdAt.toISOString(),
        updatedAt: CREATE_RESULT.updatedAt.toISOString(),
        pushedAt: CREATE_RESULT.pushedAt.toISOString(),
      });
  });

  test("GET /gitHubRepositories", async () => {
    await request(app.getHttpServer())
      .get("/gitHubRepositories")
      .expect(HttpStatus.OK)
      .expect([
        {
          ...FIND_MANY_RESULT[0],
          createdAt: FIND_MANY_RESULT[0].createdAt.toISOString(),
          updatedAt: FIND_MANY_RESULT[0].updatedAt.toISOString(),
          pushedAt: FIND_MANY_RESULT[0].pushedAt.toISOString(),
        },
      ]);
  });

  test("GET /gitHubRepositories/:id non existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/gitHubRepositories"}/${nonExistingId}`)
      .expect(404)
      .expect({
        statusCode: 404,
        message: `No resource was found for {"${"id"}":"${nonExistingId}"}`,
        error: "Not Found",
      });
  });

  test("GET /gitHubRepositories/:id existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/gitHubRepositories"}/${existingId}`)
      .expect(HttpStatus.OK)
      .expect({
        ...FIND_ONE_RESULT,
        createdAt: FIND_ONE_RESULT.createdAt.toISOString(),
        updatedAt: FIND_ONE_RESULT.updatedAt.toISOString(),
        pushedAt: FIND_ONE_RESULT.pushedAt.toISOString(),
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
