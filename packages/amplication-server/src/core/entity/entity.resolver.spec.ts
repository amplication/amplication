import { Test, TestingModule } from '@nestjs/testing';
import { gql } from 'apollo-server-express';
import {
  ApolloServerTestClient,
  createTestClient
} from 'apollo-server-testing';
import { createApolloServerTestClient } from 'test/nestjs-apollo-testing';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { mockGqlAuthGuardCanActivate } from 'test/gql-auth-mock';
import { EntityModule } from './entity.module';
import { EntityResolver } from './entity.resolver';
import { EntityService } from './entity.service';
import { INestApplication } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { GqlExecutionContext, GraphQLModule } from '@nestjs/graphql';
import winston from 'winston/lib/winston/config';
import { WinstonModule, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { Entity } from 'src/models/Entity';
import { User } from 'src/models/User';

const EXAMPLE_ID = 'exampleId';
const EXAMPLE_USER_ID = 'exampleUserId';

const EXAMPLE_ENTITY: Entity = {
  id: EXAMPLE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  appId: 'exampleAppId',
  name: 'exampleName',
  displayName: 'exampleDisplayName',
  pluralDisplayName: 'examplePluralDisplayName'
};

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date()
};

const FIND_ONE_QUERY = gql`
  query($id: String!) {
    entity(where: { id: $id }) {
      id
      createdAt
      updatedAt
      appId
      name
      displayName
      pluralDisplayName
    }
  }
`;

const FIND_MANY_QUERY = gql`
  query($id: String) {
    entities(where: { id: { equals: $id } }) {
      id
      createdAt
      updatedAt
      appId
      name
      displayName
      pluralDisplayName
    }
  }
`;

const CREATE_ONE_QUERY = gql`
  mutation(
    $name: String!
    $displayName: String!
    $pluralDisplayName: String!
    $id: String!
  ) {
    createOneEntity(
      data: {
        name: $name
        displayName: $displayName
        pluralDisplayName: $pluralDisplayName
        app: { connect: { id: $id } }
      }
    ) {
      id
      createdAt
      updatedAt
      appId
      name
      displayName
      pluralDisplayName
    }
  }
`;

const entityMock = jest.fn(() => EXAMPLE_ENTITY);
const entitiesMock = jest.fn(() => [EXAMPLE_ENTITY]);
const entityCreateOneMock = jest.fn(() => EXAMPLE_ENTITY);

const mockCanActivate = jest.fn(context => {
  const ctx = (GqlExecutionContext.create(
    context
  ).getContext().req.user = EXAMPLE_USER);
  console.log(context);
  return true;
});

describe('EntityResolver', () => {
  let app: INestApplication;
  let apolloClient: ApolloServerTestClient;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        EntityResolver,
        {
          provide: EntityService,
          useClass: jest.fn(() => ({
            entity: entityMock,
            entities: entitiesMock,
            createOneEntity: entityCreateOneMock
          }))
        },
        {
          provide: UserService,
          useClass: jest.fn(() => ({}))
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useClass: jest.fn(() => ({
            error: jest.fn()
          }))
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

  it('should find one entity', async () => {
    const res = await apolloClient.query({
      query: FIND_ONE_QUERY,
      variables: { id: EXAMPLE_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      entity: {
        ...EXAMPLE_ENTITY,
        createdAt: EXAMPLE_ENTITY.createdAt.toISOString(),
        updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString()
      }
    });
  });

  it('should find many entites', async () => {
    const res = await apolloClient.query({
      query: FIND_MANY_QUERY,
      variables: { id: EXAMPLE_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      entities: [
        {
          ...EXAMPLE_ENTITY,
          createdAt: EXAMPLE_ENTITY.createdAt.toISOString(),
          updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString()
        }
      ]
    });
  });

  it('should create one entity', async () => {
    const res = await apolloClient.query({
      query: CREATE_ONE_QUERY,
      variables: {
        name: EXAMPLE_ENTITY.name,
        displayName: EXAMPLE_ENTITY.displayName,
        pluralDisplayName: EXAMPLE_ENTITY.pluralDisplayName,
        id: EXAMPLE_ID
      }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      createOneEntity: {
        ...EXAMPLE_ENTITY,
        createdAt: EXAMPLE_ENTITY.createdAt.toISOString(),
        updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString()
      }
    });
  });
});
