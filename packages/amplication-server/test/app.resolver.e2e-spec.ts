import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ExecutionContext } from '@nestjs/common';
import request from 'supertest';
import { print } from 'graphql';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaClient, EnumBuildStatus } from '@prisma/client';
import { Queue } from 'bull';
import { gql } from 'apollo-server-express';
import { StorageService } from '@codebrew/nestjs-storage';
import { getQueueToken } from '@nestjs/bull';
import { AppModule } from 'src/app.module';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { QUEUE_NAME as BUILD_QUEUE_NAME } from 'src/core/build/constants';
import { BuildRequest } from 'src/core/build/dto/BuildRequest';
import { getBuildFilePath } from 'src/core/build/storage';

const EXAMPLE_APP_NAME = 'e2e:ExampleAppName';
const EXAMPLE_ACCOUNT_EMAIL = 'e2e:ExampleAccountEmail';
const EXAMPLE_ORGANIZATION_NAME = 'e2e:ExampleOrganizationName';

const CREATE_BUILD_MUTATION = gql`
  mutation($app: String!) {
    createBuild(data: { app: { connect: { id: $app } } }) {
      id
      createdAt
      app {
        id
      }
      createdBy {
        id
      }
      status
    }
  }
`;

async function cleanDatabase(prisma: PrismaClient): Promise<void> {
  await prisma.build.deleteMany({
    where: {
      app: { name: EXAMPLE_APP_NAME }
    }
  });
  await prisma.app.deleteMany({
    where: { name: EXAMPLE_APP_NAME }
  });
  await prisma.user.deleteMany({
    where: { account: { email: EXAMPLE_ACCOUNT_EMAIL } }
  });
  await prisma.account.deleteMany({ where: { email: EXAMPLE_ACCOUNT_EMAIL } });
  await prisma.organization.deleteMany({
    where: { name: EXAMPLE_ORGANIZATION_NAME }
  });
}

async function seedDatabase(prisma: PrismaClient): Promise<void> {
  await cleanDatabase(prisma);
  await prisma.app.create({
    data: {
      name: EXAMPLE_APP_NAME,
      description: 'Example application for E2E testing',
      organization: {
        create: {
          name: EXAMPLE_ORGANIZATION_NAME,
          address: 'exampleAddress',
          defaultTimeZone: 'exampleDefaultTimeZone',
          users: {
            create: {
              account: {
                create: {
                  email: EXAMPLE_ACCOUNT_EMAIL,
                  firstName: 'exampleFirstName',
                  lastName: 'exampleLastName',
                  password: 'examplePassword'
                }
              }
            }
          }
        }
      }
    }
  });
}

async function getExampleApp(prisma: PrismaClient) {
  const matchingApps = await prisma.app.findMany({
    where: { name: EXAMPLE_APP_NAME }
  });
  const [exampleApp] = matchingApps;
  return exampleApp;
}

async function getExampleUser(prisma: PrismaClient) {
  const matchingUsers = await prisma.user.findMany({
    where: { account: { email: EXAMPLE_ACCOUNT_EMAIL } }
  });
  const [exampleUser] = matchingUsers;
  return exampleUser;
}

async function removeAllJobs(buildQueue: Queue<BuildRequest>) {
  const jobs = await buildQueue.getJobs([]);
  await Promise.all(jobs.map(job => job.remove()));
}

const mockCanActivate = jest.fn();

describe('AppController (e2e)', () => {
  const gqlAuthGuard = {
    canActivate: mockCanActivate
  };
  const prisma = new PrismaClient();

  beforeAll(async () => {
    await seedDatabase(prisma);
  });

  afterAll(async () => {
    await cleanDatabase(prisma);
    await prisma.$disconnect();
  });

  let app: INestApplication;
  let buildQueue: Queue<BuildRequest>;
  let storageService: StorageService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideGuard(GqlAuthGuard)
      .useValue(gqlAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    buildQueue = moduleFixture.get(getQueueToken(BUILD_QUEUE_NAME));
    storageService = moduleFixture.get(StorageService);
  });

  afterEach(async () => {
    await app.close();
  });

  it('creates a build', async () => {
    await removeAllJobs(buildQueue);
    const exampleApp = await getExampleApp(prisma);
    const exampleUser = await getExampleUser(prisma);
    mockCanActivate.mockImplementation((context: ExecutionContext) => {
      const ctx = GqlExecutionContext.create(context);
      const { req } = ctx.getContext();
      req.user = {
        id: exampleUser.id
      };
      return true;
    });
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .type('form')
      .send({
        query: print(CREATE_BUILD_MUTATION),
        variables: { app: exampleApp.id }
      });
    expect(response.status).toBe(200);
    const parsedResponse = JSON.parse(response.text);
    expect(parsedResponse).toEqual({
      data: {
        createBuild: {
          id: expect.any(String),
          createdAt: expect.any(String),
          app: {
            id: exampleApp.id
          },
          createdBy: {
            id: expect.any(String)
          },
          status: EnumBuildStatus.Waiting
        }
      }
    });
    const buildId = parsedResponse.data.createBuild.id;
    const [job] = await buildQueue.getJobs([]);
    await job.finished();
    await buildQueue.close();
    const disk = storageService.getDisk();
    const buildFilePath = getBuildFilePath(buildId);
    expect(disk.getStat(buildFilePath)).resolves;
    await disk.delete(buildFilePath);
  });
});
