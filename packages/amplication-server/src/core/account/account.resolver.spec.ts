import { Test, TestingModule } from '@nestjs/testing';
import { gql } from 'apollo-server-express';
import {
  ApolloServerTestClient,
  createTestClient
} from 'apollo-server-testing';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { User, Account } from 'src/models';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { mockGqlAuthGuardCanActivate } from '../../../test/gql-auth-mock';
import { AccountResolver } from './account.resolver';
import { PrismaService } from 'nestjs-prisma';
import { AccountService } from './account.service';

const EXAMPLE_USER_ID = 'exampleUserId';

const EXAMPLE_ACCOUNT_ID = 'exampleAccountId';
const EXAMPLE_EMAIL = 'exampleEmail';
const EXAMPLE_FIRST_NAME = 'exampleFirstName';
const EXAMPLE_LAST_NAME = 'exampleLastName';
const EXAMPLE_PASSWORD = 'examplePassword';

const EXAMPLE_ACCOUNT: Account = {
  id: EXAMPLE_ACCOUNT_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  email: EXAMPLE_EMAIL,
  firstName: EXAMPLE_FIRST_NAME,
  lastName: EXAMPLE_LAST_NAME,
  password: EXAMPLE_PASSWORD
};

const EXAMPLE_UPDATED_ACCOUNT = {
  ...EXAMPLE_ACCOUNT,
  firstName: 'Example Updated First Name',
  lastName: 'Example Updated Last Name'
};

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  account: EXAMPLE_ACCOUNT
};

const ME_QUERY = gql`
  query {
    me {
      id
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_ACCOUNT_MUTATION = gql`
  mutation($data: UpdateAccountInput!) {
    updateAccount(data: $data) {
      id
      createdAt
      updatedAt
      email
      firstName
      lastName
      password
    }
  }
`;

const updateAccountMock = jest.fn(() => {
  return EXAMPLE_UPDATED_ACCOUNT;
});

const mockCanActivate = jest.fn(mockGqlAuthGuardCanActivate(EXAMPLE_USER));

describe('AccountResolver', () => {
  let app: INestApplication;
  let apolloClient: ApolloServerTestClient;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        AccountResolver,
        {
          provide: AccountService,
          useClass: jest.fn(() => ({
            updateAccount: updateAccountMock
          }))
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useClass: jest.fn(() => ({
            error: jest.fn()
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

  it('should update an Account', async () => {
    const variables = {
      data: {
        firstName: EXAMPLE_UPDATED_ACCOUNT.firstName,
        lastName: EXAMPLE_UPDATED_ACCOUNT.lastName
      }
    };
    const res = await apolloClient.query({
      query: UPDATE_ACCOUNT_MUTATION,
      variables
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      updateAccount: {
        ...EXAMPLE_UPDATED_ACCOUNT,
        createdAt: EXAMPLE_ACCOUNT.createdAt.toISOString(),
        updatedAt: EXAMPLE_ACCOUNT.updatedAt.toISOString()
      }
    });
    expect(updateAccountMock).toBeCalledTimes(1);
    expect(updateAccountMock).toBeCalledWith({
      where: { id: EXAMPLE_ACCOUNT_ID },
      data: variables.data
    });
  });
});
