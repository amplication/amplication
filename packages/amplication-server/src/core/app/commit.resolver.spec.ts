import { Test, TestingModule } from '@nestjs/testing';
import { gql } from 'apollo-server-express';
import {
  ApolloServerTestClient,
  createTestClient
} from 'apollo-server-testing';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { mockGqlAuthGuardCanActivate } from '../../../test/gql-auth-mock';
import { CommitResolver } from './commit.resolver';
import { UserService } from '../user/user.service';
import { User } from 'src/models';

const EXAMPLE_USER_ID = 'exampleUserId';

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date()
};

const USER_QUERY = gql`
  query {
    user {
      id
      createdAt
      updatedAt
    }
  }
`;

const userServiceFindUserMock = jest.fn(() => EXAMPLE_USER);

const mockCanActivate = jest.fn(() => true);

describe('CommitResolver', () => {
  let app: INestApplication;
  let apolloClient: ApolloServerTestClient;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        CommitResolver,
        {
          provide: UserService,
          useClass: jest.fn(() => ({
            findUser: userServiceFindUserMock
          }))
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

  it('should find a user', async () => {
    const res = await apolloClient.query({
      query: USER_QUERY,
      variables: {}
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      user: {
        ...EXAMPLE_USER,
        createdAt: EXAMPLE_USER.createdAt.toISOString(),
        updatedAt: EXAMPLE_USER.updatedAt.toISOString()
      }
    });
  });
});
