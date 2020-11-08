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
import { User, UserRole } from 'src/models';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

const EXAMPLE_USER_ID = 'exampleUserId';
const EXAMPLE_USER_ROLE_ID = 'exampleUserRoleId';
const EXAMPLE_ROLE = 'exampleUserRole';

const EXAMPLE_USER_ROLE: UserRole = {
  id: EXAMPLE_USER_ROLE_ID,
  role: EXAMPLE_ROLE,
  createdAt: new Date(),
  updatedAt: new Date()
};

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  userRoles: [EXAMPLE_USER_ROLE]
};

const USER_ROLES_QUERY = gql`
  query($userId: String!) {
    user(where: { id: $userId }) {
      userRoles {
        id
        role
        createdAt
        updatedAt
      }
    }
  }
`;

const mockCanActivate = jest.fn(mockGqlAuthGuardCanActivate(EXAMPLE_USER));

describe('UserResolver', () => {
  let app: INestApplication;
  let apolloClient: ApolloServerTestClient;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
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

  it('should get User Roles', async () => {
    const res = await apolloClient.query({
      query: USER_ROLES_QUERY,
      variables: { userId: EXAMPLE_USER_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      userRoles: [
        {
          ...EXAMPLE_USER_ROLE,
          createdAt: EXAMPLE_USER_ROLE.createdAt.toISOString,
          updatedAt: EXAMPLE_USER_ROLE.updatedAt.toISOString
        }
      ]
    });
  });
});
