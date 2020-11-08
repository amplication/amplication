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
import { AuthService } from './auth.service';
import { mockGqlAuthGuardCanActivate } from '../../../test/gql-auth-mock';
import { AuthResolver } from './auth.resolver';
import { Auth, User, Account } from 'src/models';

const EXAMPLE_USER_ID = 'exampleUserId';
const EXAMPLE_TOKEN = 'exampleToken';
const EXAMPLE_ACCOUNT_ID = 'exampleAccountId';
const EXAMPLE_EMAIL = 'exampleEmail';
const EXAMPLE_FIRST_NAME = 'exampleFirstName';
const EXAMPLE_LAST_NAME = 'exampleLastName';
const EXAMPLE_PASSWORD = 'examplePassword';
const EXAMPLE_ORGANIZATION_NAME = 'exampleOrganizationName';
const EXAMPLE_TIME_ZONE = 'exampleTimeZone';
const EXAMPLE_ADDRESS = 'exampleAddress';

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date()
};

const EXAMPLE_ACCOUNT: Account = {
  id: EXAMPLE_ACCOUNT_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  email: EXAMPLE_EMAIL,
  firstName: EXAMPLE_FIRST_NAME,
  lastName: EXAMPLE_LAST_NAME,
  password: EXAMPLE_PASSWORD
};

const EXAMPLE_AUTH: Auth = {
  token: EXAMPLE_TOKEN
};

const SIGNUP_MUTATION = gql`
  mutation(
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
    $organizationName: String!
    $defaultTimeZone: String!
    $address: String!
  ) {
    signup(
      data: {
        email: $email
        password: $password
        firstName: $firstName
        lastName: $lastName
        organizationName: $organizationName
        defaultTimeZone: $defaultTimeZone
        address: $address
      }
    ) {
      token
    }
  }
`;

const mockCanActivate = jest.fn(mockGqlAuthGuardCanActivate(EXAMPLE_USER));

const ME_QUERY = gql`
  query {
    me {
      id
      createdAt
      updatedAt
    }
  }
`;

const signUpMock = jest.fn(() => EXAMPLE_AUTH);

describe('AuthResolver', () => {
  let app: INestApplication;
  let apolloClient: ApolloServerTestClient;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useClass: jest.fn(() => ({
            signup: signUpMock
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

  it('should return current user', async () => {
    const res = await apolloClient.query({
      query: ME_QUERY
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      me: {
        id: EXAMPLE_USER.id,
        createdAt: EXAMPLE_USER.createdAt.toISOString(),
        updatedAt: EXAMPLE_USER.updatedAt.toISOString()
      }
    });
  });

  it('should signup', async () => {
    const variables = {
      email: EXAMPLE_EMAIL,
      password: EXAMPLE_PASSWORD,
      firstName: EXAMPLE_FIRST_NAME,
      lastName: EXAMPLE_LAST_NAME,
      organizationName: EXAMPLE_ORGANIZATION_NAME,
      defaultTimeZone: EXAMPLE_TIME_ZONE,
      address: EXAMPLE_ADDRESS
    };
    const res = await apolloClient.mutate({
      mutation: SIGNUP_MUTATION,
      variables: variables
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      signup: {
        ...EXAMPLE_AUTH
      }
    });
  });
});
