import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { JsonSchemaValidationModule } from 'src/services/jsonSchemaValidation.module';
import { BuildService } from '../build/build.service';
import { EntityService } from '../entity/entity.service';
import { EnvironmentService } from '../environment/environment.service';
import { gql } from 'apollo-server-express';
import {
  ApolloServerTestClient,
  createTestClient
} from 'apollo-server-testing';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { AppResolver } from './app.resolver';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppService } from './app.service';
import { App } from 'src/models/App';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { Entity } from 'src/models/Entity';
import { Build } from '../build/dto/Build';
import { Environment } from '../environment/dto/Environment';

const EXAMPLE_APP_ID = 'exampleAppId';
const EXAMPLE_NAME = 'exampleName';
const EXAMPLE_DESCRIPTION = 'exampleDescription';
const EXAMPLE_DISPLAY_NAME = 'exampleDisplayName';
const EXAMPLE_PLURAL_DISPLAY_NAME = 'examplePluralDisplayName';

const EXAMPLE_BUILD_ID = 'exampleBuildId';
const EXAMPLE_USER_ID = 'exampleUserId';
const EXAMPLE_VERSION = 'exampleVersion';
const EXAMPLE_ACTION_ID = 'exampleActionId';

const EXAMPLE_ENVIRONMENT_ID = 'exampleEnvironmentId';
const EXAMPLE_ADDRESS = 'exampleAddress';

const EXAMPLE_ENTITY_ID = 'exampleEntityId';

const EXAMPLE_ENVIRONMENT: Environment = {
  id: EXAMPLE_ENVIRONMENT_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  appId: EXAMPLE_APP_ID,
  name: EXAMPLE_NAME,
  address: EXAMPLE_ADDRESS
};

const EXAMPLE_BUILD: Build = {
  id: EXAMPLE_BUILD_ID,
  userId: EXAMPLE_USER_ID,
  appId: EXAMPLE_APP_ID,
  version: EXAMPLE_VERSION,
  actionId: EXAMPLE_ACTION_ID,
  createdAt: new Date()
};

const EXAMPLE_ENTITY: Entity = {
  id: EXAMPLE_ENTITY_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  appId: EXAMPLE_APP_ID,
  name: EXAMPLE_NAME,
  displayName: EXAMPLE_DISPLAY_NAME,
  pluralDisplayName: EXAMPLE_PLURAL_DISPLAY_NAME
};

const EXAMPLE_APP: App = {
  id: EXAMPLE_APP_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_NAME,
  description: EXAMPLE_DESCRIPTION,
  entities: [EXAMPLE_ENTITY],
  builds: [EXAMPLE_BUILD],
  environments: [EXAMPLE_ENVIRONMENT]
};

const FIND_ONE_APP_QUERY = gql`
  query($id: String!) {
    app(where: { id: $id }) {
      id
      createdAt
      updatedAt
      name
      description
      entities {
        id
        createdAt
        updatedAt
        appId
        name
        displayName
        pluralDisplayName
      }
      builds {
        id
        userId
        appId
        version
        actionId
        createdAt
      }
      environments {
        id
        createdAt
        updatedAt
        appId
        name
        address
      }
    }
  }
`;

const FIND_MANY_ENTITIES_QUERY = gql`
  query($appId: String!, $entityId: String!) {
    app(where: { id: $appId }) {
      entities(where: { id: { equals: $entityId } }) {
        id
        createdAt
        updatedAt
        appId
        name
        displayName
        pluralDisplayName
      }
    }
  }
`;

const FIND_MANY_BUILDS_QUERY = gql`
  query($appId: String!) {
    app(where: { id: $appId }) {
      builds {
        id
        userId
        appId
        version
        actionId
        createdAt
      }
    }
  }
`;

const FIND_MANY_ENVIRONMENTS_QUERY = gql`
  query($appId: String!) {
    app(where: { id: $appId }) {
      environments {
        id
        createdAt
        updatedAt
        appId
        name
        address
      }
    }
  }
`;

const appMock = jest.fn(() => {
  return EXAMPLE_APP;
});
const entitiesMock = jest.fn(() => {
  return [EXAMPLE_ENTITY];
});
const findManyBuildMock = jest.fn(() => {
  return [EXAMPLE_BUILD];
});
const findManyEnvironmentsMock = jest.fn(() => {
  return [EXAMPLE_ENVIRONMENT];
});

const mockCanActivate = jest.fn(() => true);

describe('AppService', () => {
  let app: INestApplication;
  let apolloClient: ApolloServerTestClient;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        AppResolver,
        {
          provide: AppService,
          useClass: jest.fn(() => ({
            app: appMock
          }))
        },
        {
          provide: EntityService,
          useClass: jest.fn(() => ({
            entities: entitiesMock
          }))
        },
        {
          provide: BuildService,
          useClass: jest.fn(() => ({
            findMany: findManyBuildMock
          }))
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useClass: jest.fn(() => ({
            error: jest.fn()
          }))
        },
        {
          provide: EnvironmentService,
          useClass: jest.fn(() => ({
            findMany: findManyEnvironmentsMock
          }))
        },
        {
          provide: PrismaService,
          useClass: jest.fn(() => ({}))
        },
        {
          provide: ConfigService,
          useClass: jest.fn(() => ({
            get: jest.fn()
          }))
        }
      ],
      imports: [GraphQLModule.forRoot({ autoSchemaFile: true })]
    })
      .overrideGuard(GqlAuthGuard)
      .useValue({ canActivate: mockCanActivate })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    const graphqlModule = moduleFixture.get(GraphQLModule) as any;
    apolloClient = createTestClient(graphqlModule.apolloServer);
  });

  it('should find one app', async () => {
    const res = await apolloClient.query({
      query: FIND_ONE_APP_QUERY,
      variables: { id: EXAMPLE_APP_ID }
    });
    const args = { where: { id: EXAMPLE_APP_ID } };
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      app: {
        ...EXAMPLE_APP,
        createdAt: EXAMPLE_APP.createdAt.toISOString(),
        updatedAt: EXAMPLE_APP.updatedAt.toISOString(),
        entities: [
          {
            ...EXAMPLE_ENTITY,
            createdAt: EXAMPLE_ENTITY.createdAt.toISOString(),
            updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString()
          }
        ],
        builds: [
          {
            ...EXAMPLE_BUILD,
            createdAt: EXAMPLE_BUILD.createdAt.toISOString()
          }
        ],
        environments: [
          {
            ...EXAMPLE_ENVIRONMENT,
            createdAt: EXAMPLE_ENVIRONMENT.createdAt.toISOString(),
            updatedAt: EXAMPLE_ENVIRONMENT.updatedAt.toISOString()
          }
        ]
      }
    });
    expect(appMock).toBeCalledTimes(1);
    expect(appMock).toBeCalledWith(args);
  });

  it('should find many entities', async () => {
    const res = await apolloClient.query({
      query: FIND_MANY_ENTITIES_QUERY,
      variables: { appId: EXAMPLE_APP_ID, entityId: EXAMPLE_ENTITY_ID }
    });
    const args = {
      where: { id: { equals: EXAMPLE_ENTITY_ID }, app: { id: EXAMPLE_APP_ID } }
    };
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      app: {
        entities: [
          {
            ...EXAMPLE_ENTITY,
            createdAt: EXAMPLE_ENTITY.createdAt.toISOString(),
            updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString()
          }
        ]
      }
    });
    expect(entitiesMock).toBeCalledTimes(1);
    expect(entitiesMock).toBeCalledWith(args);
  });

  it('should find many builds', async () => {
    const res = await apolloClient.query({
      query: FIND_MANY_BUILDS_QUERY,
      variables: { appId: EXAMPLE_APP_ID }
    });
    const args = {
      where: { app: { id: EXAMPLE_APP_ID } }
    };
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      app: {
        builds: [
          {
            ...EXAMPLE_BUILD,
            createdAt: EXAMPLE_BUILD.createdAt.toISOString()
          }
        ]
      }
    });
    expect(findManyBuildMock).toBeCalledTimes(1);
    expect(findManyBuildMock).toBeCalledWith(args);
  });

  it('should find many environments', async () => {
    const res = await apolloClient.query({
      query: FIND_MANY_ENVIRONMENTS_QUERY,
      variables: { appId: EXAMPLE_APP_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      app: {
        environments: [
          {
            ...EXAMPLE_ENVIRONMENT,
            createdAt: EXAMPLE_ENVIRONMENT.createdAt.toISOString(),
            updatedAt: EXAMPLE_ENVIRONMENT.updatedAt.toISOString()
          }
        ]
      }
    });
  });
});
