import { Test, TestingModule } from "@nestjs/testing";
import {
  ApolloDriver,
  ApolloDriverConfig,
  getApolloServer,
} from "@nestjs/apollo";
import { PrismaService } from "../../prisma/prisma.service";
import { gql } from "apollo-server-express";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { INestApplication } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ConfigService } from "@nestjs/config";
import { ResourceRoleService } from "./resourceRole.service";
import { ResourceRoleResolver } from "./resourceRole.resolver";
import { ResourceRole } from "../../models";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { ApolloServerBase } from "apollo-server-core";

const EXAMPLE_RESOURCE_ROLE_ID = "EXAMPLE_APP_ROLE_ID";
const EXAMPLE_NAME = "EXAMPLE_NAME";
const EXAMPLE_DISPLAY_NAME = "EXAMPLE_DISPLAY_NAME";
const EXAMPLE_DESCRIPTION = "exampleDescription";

const EXAMPLE_RESOURCE_ID = "exampleResourceId";

const EXAMPLE_VERSION = 1;

const EXAMPLE_RESOURCE_ROLE: ResourceRole = {
  id: EXAMPLE_RESOURCE_ROLE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_NAME,
  displayName: EXAMPLE_DISPLAY_NAME,
};

const GET_RESOURCE_ROLE_QUERY = gql`
  query ($id: String!, $version: Float!) {
    resourceRole(where: { id: $id }, version: $version) {
      id
      createdAt
      updatedAt
      name
      displayName
    }
  }
`;

const GET_RESOURCE_ROLES_QUERY = gql`
  query {
    resourceRoles {
      id
      createdAt
      updatedAt
      name
      displayName
    }
  }
`;

const CREATE_RESOURCE_ROLE_MUTATION = gql`
  mutation (
    $name: String!
    $description: String!
    $displayName: String!
    $resourceId: String!
  ) {
    createResourceRole(
      data: {
        name: $name
        description: $description
        displayName: $displayName
        resource: { connect: { id: $resourceId } }
      }
    ) {
      id
      createdAt
      updatedAt
      name
      displayName
    }
  }
`;

const DELETE_APP_ROLE_MUTATION = gql`
  mutation ($id: String!) {
    deleteResourceRole(where: { id: $id }) {
      id
      createdAt
      updatedAt
      name
      displayName
    }
  }
`;

const UPDATE_APP_ROLE_MUTATION = gql`
  mutation ($id: String!, $displayName: String!) {
    updateResourceRole(
      where: { id: $id }
      data: { displayName: $displayName }
    ) {
      id
      createdAt
      updatedAt
      name
      displayName
    }
  }
`;

const getResourceRoleMock = jest.fn(() => {
  return EXAMPLE_RESOURCE_ROLE;
});
const getResourceRolesMock = jest.fn(() => {
  return [EXAMPLE_RESOURCE_ROLE];
});
const createResourceRoleMock = jest.fn(() => {
  return EXAMPLE_RESOURCE_ROLE;
});
const deleteResourceRoleMock = jest.fn(() => {
  return EXAMPLE_RESOURCE_ROLE;
});
const updateResourceRoleMock = jest.fn(() => {
  return EXAMPLE_RESOURCE_ROLE;
});

const mockCanActivate = jest.fn(() => true);

describe("ResourceRoleResolver", () => {
  let app: INestApplication;
  let apolloClient: ApolloServerBase;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        ResourceRoleResolver,
        {
          provide: ResourceRoleService,
          useClass: jest.fn(() => ({
            getResourceRole: getResourceRoleMock,
            getResourceRoles: getResourceRolesMock,
            createResourceRole: createResourceRoleMock,
            deleteResourceRole: deleteResourceRoleMock,
            updateResourceRole: updateResourceRoleMock,
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

  it("should get one ResourceRole", async () => {
    const res = await apolloClient.executeOperation({
      query: GET_RESOURCE_ROLE_QUERY,
      variables: { id: EXAMPLE_RESOURCE_ROLE_ID, version: EXAMPLE_VERSION },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      resourceRole: {
        ...EXAMPLE_RESOURCE_ROLE,
        createdAt: EXAMPLE_RESOURCE_ROLE.createdAt.toISOString(),
        updatedAt: EXAMPLE_RESOURCE_ROLE.updatedAt.toISOString(),
      },
    });
    expect(getResourceRoleMock).toBeCalledTimes(1);
    expect(getResourceRoleMock).toBeCalledWith({
      where: { id: EXAMPLE_RESOURCE_ROLE_ID },
      version: EXAMPLE_VERSION,
    });
  });

  it("should get Many ResourceRoles", async () => {
    const res = await apolloClient.executeOperation({
      query: GET_RESOURCE_ROLES_QUERY,
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      resourceRoles: [
        {
          ...EXAMPLE_RESOURCE_ROLE,
          createdAt: EXAMPLE_RESOURCE_ROLE.createdAt.toISOString(),
          updatedAt: EXAMPLE_RESOURCE_ROLE.updatedAt.toISOString(),
        },
      ],
    });
    expect(getResourceRolesMock).toBeCalledTimes(1);
    expect(getResourceRolesMock).toBeCalledWith({});
  });

  it("should create a resourceRole", async () => {
    const res = await apolloClient.executeOperation({
      query: CREATE_RESOURCE_ROLE_MUTATION,
      variables: {
        name: EXAMPLE_NAME,
        description: EXAMPLE_DESCRIPTION,
        displayName: EXAMPLE_DISPLAY_NAME,
        resourceId: EXAMPLE_RESOURCE_ID,
      },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      createResourceRole: {
        ...EXAMPLE_RESOURCE_ROLE,
        createdAt: EXAMPLE_RESOURCE_ROLE.createdAt.toISOString(),
        updatedAt: EXAMPLE_RESOURCE_ROLE.updatedAt.toISOString(),
      },
    });
    expect(createResourceRoleMock).toBeCalledTimes(1);
    expect(createResourceRoleMock).toBeCalledWith({
      data: {
        name: EXAMPLE_NAME,
        description: EXAMPLE_DESCRIPTION,
        displayName: EXAMPLE_DISPLAY_NAME,
        resource: { connect: { id: EXAMPLE_RESOURCE_ID } },
      },
    });
  });

  it("should delete a resourceRole", async () => {
    const res = await apolloClient.executeOperation({
      query: DELETE_APP_ROLE_MUTATION,
      variables: { id: EXAMPLE_RESOURCE_ROLE_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      deleteResourceRole: {
        ...EXAMPLE_RESOURCE_ROLE,
        createdAt: EXAMPLE_RESOURCE_ROLE.createdAt.toISOString(),
        updatedAt: EXAMPLE_RESOURCE_ROLE.updatedAt.toISOString(),
      },
    });
    expect(deleteResourceRoleMock).toBeCalledTimes(1);
    expect(deleteResourceRoleMock).toBeCalledWith({
      where: { id: EXAMPLE_RESOURCE_ROLE_ID },
    });
  });

  it("should update a resourceRole", async () => {
    const res = await apolloClient.executeOperation({
      query: UPDATE_APP_ROLE_MUTATION,
      variables: {
        id: EXAMPLE_RESOURCE_ROLE_ID,
        displayName: EXAMPLE_DISPLAY_NAME,
      },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      updateResourceRole: {
        ...EXAMPLE_RESOURCE_ROLE,
        createdAt: EXAMPLE_RESOURCE_ROLE.createdAt.toISOString(),
        updatedAt: EXAMPLE_RESOURCE_ROLE.updatedAt.toISOString(),
      },
    });
    expect(updateResourceRoleMock).toBeCalledTimes(1);
    expect(updateResourceRoleMock).toBeCalledWith({
      where: { id: EXAMPLE_RESOURCE_ROLE_ID },
      data: { displayName: EXAMPLE_DISPLAY_NAME },
    });
  });
});
