import { Test, TestingModule } from "@nestjs/testing";
import { gql } from "apollo-server-express";
import { INestApplication } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { ConfigService } from "@nestjs/config";
import { User, Account } from "../../models";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { mockGqlAuthGuardCanActivate } from "../../../test/gql-auth-mock";
import { AccountResolver } from "./account.resolver";
import { PrismaService } from "../../prisma/prisma.service";
import { AccountService } from "./account.service";
import { ApolloServerBase } from "apollo-server-core";
import {
  ApolloDriver,
  ApolloDriverConfig,
  getApolloServer,
} from "@nestjs/apollo";
import { EnumPreviewAccountType } from "../auth/dto/EnumPreviewAccountType";

const EXAMPLE_USER_ID = "exampleUserId";

const EXAMPLE_ACCOUNT_ID = "exampleAccountId";
const EXAMPLE_EMAIL = "exampleEmail";
const EXAMPLE_FIRST_NAME = "exampleFirstName";
const EXAMPLE_LAST_NAME = "exampleLastName";
const EXAMPLE_PASSWORD = "examplePassword";

const EXAMPLE_ACCOUNT: Account = {
  id: EXAMPLE_ACCOUNT_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  email: EXAMPLE_EMAIL,
  firstName: EXAMPLE_FIRST_NAME,
  lastName: EXAMPLE_LAST_NAME,
  password: EXAMPLE_PASSWORD,
  previewAccountType: EnumPreviewAccountType.None,
  previewAccountEmail: null,
};

const EXAMPLE_UPDATED_ACCOUNT = {
  ...EXAMPLE_ACCOUNT,
  firstName: "Example Updated First Name",
  lastName: "Example Updated Last Name",
};

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  account: EXAMPLE_ACCOUNT,
  isOwner: true,
};

const UPDATE_ACCOUNT_MUTATION = gql`
  mutation ($data: UpdateAccountInput!) {
    updateAccount(data: $data) {
      id
      createdAt
      updatedAt
      email
      firstName
      lastName
      password
      previewAccountType
      previewAccountEmail
    }
  }
`;

const updateAccountMock = jest.fn(() => {
  return EXAMPLE_UPDATED_ACCOUNT;
});

const mockCanActivate = jest.fn(mockGqlAuthGuardCanActivate(EXAMPLE_USER));

const GET_ACCOUNT_QUERY = gql`
  query {
    account {
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

describe("AccountResolver", () => {
  let app: INestApplication;
  let apolloClient: ApolloServerBase;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        AccountResolver,
        {
          provide: AccountService,
          useClass: jest.fn(() => ({
            updateAccount: updateAccountMock,
          })),
        },
        {
          provide: AmplicationLogger,
          useClass: jest.fn(() => ({
            error: jest.fn(),
          })),
        },
        {
          provide: PrismaService,
          useClass: jest.fn(() => ({})),
        },
        {
          provide: ConfigService,
          useClass: jest.fn(() => ({
            get: jest.fn(),
          })),
        },
      ],
      imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
          autoSchemaFile: true,
          driver: ApolloDriver,
        }),
      ],
    })
      .overrideGuard(GqlAuthGuard)
      .useValue({ canActivate: mockCanActivate })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    apolloClient = getApolloServer(app);
  });

  it("should get current account", async () => {
    const res = await apolloClient.executeOperation({
      query: GET_ACCOUNT_QUERY,
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      account: {
        id: EXAMPLE_ACCOUNT.id,
        createdAt: EXAMPLE_ACCOUNT.createdAt.toISOString(),
        updatedAt: EXAMPLE_ACCOUNT.updatedAt.toISOString(),
        email: EXAMPLE_ACCOUNT.email,
        firstName: EXAMPLE_ACCOUNT.firstName,
        lastName: EXAMPLE_ACCOUNT.lastName,
        password: EXAMPLE_ACCOUNT.password,
      },
    });
  });

  it("should update an account", async () => {
    const variables = {
      data: {
        firstName: EXAMPLE_UPDATED_ACCOUNT.firstName,
        lastName: EXAMPLE_UPDATED_ACCOUNT.lastName,
      },
    };
    const res = await apolloClient.executeOperation({
      query: UPDATE_ACCOUNT_MUTATION,
      variables,
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      updateAccount: {
        ...EXAMPLE_UPDATED_ACCOUNT,
        createdAt: EXAMPLE_ACCOUNT.createdAt.toISOString(),
        updatedAt: EXAMPLE_ACCOUNT.updatedAt.toISOString(),
      },
    });
    expect(updateAccountMock).toBeCalledTimes(1);
    expect(updateAccountMock).toBeCalledWith({
      where: { id: EXAMPLE_ACCOUNT_ID },
      data: variables.data,
    });
  });
});
