import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ExecutionContext } from '@nestjs/common';
import { gql } from 'apollo-server-express';
import { ApolloServerTestClient } from 'apollo-server-testing';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaClient, EnumBuildStatus } from '@prisma/client';
import { StorageService } from '@codebrew/nestjs-storage';
import { getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';
import { AppModule } from 'src/app.module';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { QUEUE_NAME as BUILD_QUEUE_NAME } from 'src/core/build/constants';
import { BuildRequest } from 'src/core/build/dto/BuildRequest';
import { getBuildFilePath } from 'src/core/build/storage';
import set from 'lodash.set';
import { createApolloServerTestClient } from './nestjs-apollo-testing';

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

const mockCanActivate = jest.fn();

describe('AppResolver (e2e)', () => {
  const prisma = new PrismaClient();

  beforeAll(async () => {
    await seedDatabase(prisma);
  });

  afterAll(async () => {
    await cleanDatabase(prisma);
    await prisma.$disconnect();
  });

  let app: INestApplication;
  let apolloClient: ApolloServerTestClient;
  let buildQueue: Queue<BuildRequest>;
  let storageService: StorageService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideGuard(GqlAuthGuard)
      .useValue({
        canActivate: mockCanActivate
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    apolloClient = createApolloServerTestClient(moduleFixture);
    buildQueue = moduleFixture.get(getQueueToken(BUILD_QUEUE_NAME));
    storageService = moduleFixture.get(StorageService);
    await buildQueue.clean(0);
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('creates a build', async () => {
    const exampleApp = await getExampleApp(prisma);
    const exampleUser = await getExampleUser(prisma);

    mockCanActivate.mockImplementation((executionContext: ExecutionContext) => {
      const gqlExecutionContext = GqlExecutionContext.create(executionContext);
      const gqlContext = gqlExecutionContext.getContext();
      // Set user for injectContextValue to work properly
      set(gqlContext, ['req', 'user'], {
        id: exampleUser.id
      });
      return true;
    });

    const res = await apolloClient.mutate({
      mutation: CREATE_BUILD_MUTATION,
      variables: { app: exampleApp.id }
    });
    expect(res.data).toEqual({
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
    });
    const buildId = res.data.createBuild.id;
    const jobs = await buildQueue.getJobs([]);
    expect(jobs.length).toBe(1);
    const [job] = jobs;
    await job.finished();
    const disk = storageService.getDisk();
    const buildFilePath = getBuildFilePath(buildId);
    expect(disk.getStat(buildFilePath)).resolves;
    await disk.delete(buildFilePath);
    await buildQueue.close();
  });
});
