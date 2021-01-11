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
import { OrganizationService } from './organization.service';
import { OrganizationResolver } from './organization.resolver';
import { App, Organization, User } from 'src/models';
import { AppService } from '../app/app.service';

const EXAMPLE_USER_ID = 'exampleUserId';
const EXAMPLE_ORGANIZATION_ID = 'exampleOrganizationId';
const EXAMPLE_ORGANIZATION_NAME = 'exampleOrganizationName';
const EXAMPLE_TIME_ZONE = 'exampleTimeZone';
const EXAMPLE_ADDRESS = 'exampleAddress';

const EXAMPLE_APP_ID = 'exampleAppId';
const EXAMPLE_APP_NAME = 'exampleAppName';
const EXAMPLE_APP_DESCRIPTION = 'exampleAppDescription';

const EXAMPLE_EMAIL = 'exampleEmail';

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date()
};

const EXAMPLE_ORGANIZATION: Organization = {
  id: EXAMPLE_ORGANIZATION_ID,
  name: EXAMPLE_ORGANIZATION_NAME,
  defaultTimeZone: EXAMPLE_TIME_ZONE,
  address: EXAMPLE_ADDRESS,
  createdAt: new Date(),
  updatedAt: new Date()
};

const EXAMPLE_APP: App = {
  id: EXAMPLE_APP_ID,
  name: EXAMPLE_APP_NAME,
  description: EXAMPLE_APP_DESCRIPTION,
  createdAt: new Date(),
  updatedAt: new Date(),
  githubSyncEnabled: false
};

const GET_ORGANIZATION_QUERY = gql`
  query($id: String!) {
    organization(where: { id: $id }) {
      id
      name
      defaultTimeZone
      address
      createdAt
      updatedAt
    }
  }
`;

const GET_APPS_QUERY = gql`
  query($id: String!) {
    organization(where: { id: $id }) {
      apps {
        id
        name
        description
        createdAt
        updatedAt
      }
    }
  }
`;

const DELETE_ORGANIZATION_MUTATION = gql`
  mutation($id: String!) {
    deleteOrganization(where: { id: $id }) {
      id
      name
      defaultTimeZone
      address
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_ORGANIZATION_MUTATION = gql`
  mutation($id: String!) {
    updateOrganization(data: {}, where: { id: $id }) {
      id
      name
      defaultTimeZone
      address
      createdAt
      updatedAt
    }
  }
`;

const INVITE_USER_MUTATION = gql`
  mutation($email: String!) {
    inviteUser(data: { email: $email }) {
      id
      createdAt
      updatedAt
    }
  }
`;

const organizationServiceGetOrganizationMock = jest.fn(
  () => EXAMPLE_ORGANIZATION
);
const organizationServiceDeleteOrganizationMock = jest.fn(
  () => EXAMPLE_ORGANIZATION
);
const organizationServiceUpdateOrganizationMock = jest.fn(
  () => EXAMPLE_ORGANIZATION
);
const organizationServiceInviteUserMock = jest.fn(() => EXAMPLE_USER);
const appServiceAppsMock = jest.fn(() => [EXAMPLE_APP]);

const mockCanActivate = jest.fn(mockGqlAuthGuardCanActivate(EXAMPLE_USER));

describe('OrganizationResolver', () => {
  let app: INestApplication;
  let apolloClient: ApolloServerTestClient;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationResolver,
        {
          provide: OrganizationService,
          useClass: jest.fn(() => ({
            getOrganization: organizationServiceGetOrganizationMock,
            deleteOrganization: organizationServiceDeleteOrganizationMock,
            updateOrganization: organizationServiceUpdateOrganizationMock,
            inviteUser: organizationServiceInviteUserMock
          }))
        },
        {
          provide: AppService,
          useClass: jest.fn(() => ({
            apps: appServiceAppsMock
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

  it('should get an organization', async () => {
    const res = await apolloClient.query({
      query: GET_ORGANIZATION_QUERY,
      variables: { id: EXAMPLE_ORGANIZATION_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      organization: {
        ...EXAMPLE_ORGANIZATION,
        createdAt: EXAMPLE_ORGANIZATION.createdAt.toISOString(),
        updatedAt: EXAMPLE_ORGANIZATION.updatedAt.toISOString()
      }
    });
    expect(organizationServiceGetOrganizationMock).toBeCalledTimes(1);
    expect(organizationServiceGetOrganizationMock).toBeCalledWith({
      where: { id: EXAMPLE_ORGANIZATION_ID }
    });
  });

  it('should get an organization apps', async () => {
    const res = await apolloClient.query({
      query: GET_APPS_QUERY,
      variables: { id: EXAMPLE_ORGANIZATION_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      organization: {
        apps: [
          {
            ...EXAMPLE_APP,
            createdAt: EXAMPLE_APP.createdAt.toISOString(),
            updatedAt: EXAMPLE_APP.updatedAt.toISOString()
          }
        ]
      }
    });
    expect(appServiceAppsMock).toBeCalledTimes(1);
    expect(appServiceAppsMock).toBeCalledWith({
      where: { organization: { id: EXAMPLE_ORGANIZATION_ID } }
    });
  });

  it('should delete an organization', async () => {
    const res = await apolloClient.mutate({
      mutation: DELETE_ORGANIZATION_MUTATION,
      variables: { id: EXAMPLE_ORGANIZATION_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      deleteOrganization: {
        ...EXAMPLE_ORGANIZATION,
        createdAt: EXAMPLE_ORGANIZATION.createdAt.toISOString(),
        updatedAt: EXAMPLE_ORGANIZATION.updatedAt.toISOString()
      }
    });
    expect(organizationServiceDeleteOrganizationMock).toBeCalledTimes(1);
    expect(organizationServiceDeleteOrganizationMock).toBeCalledWith({
      where: { id: EXAMPLE_ORGANIZATION_ID }
    });
  });

  it('should update an organization', async () => {
    const res = await apolloClient.mutate({
      mutation: UPDATE_ORGANIZATION_MUTATION,
      variables: { id: EXAMPLE_ORGANIZATION_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      updateOrganization: {
        ...EXAMPLE_ORGANIZATION,
        createdAt: EXAMPLE_ORGANIZATION.createdAt.toISOString(),
        updatedAt: EXAMPLE_ORGANIZATION.updatedAt.toISOString()
      }
    });
    expect(organizationServiceUpdateOrganizationMock).toBeCalledTimes(1);
    expect(organizationServiceUpdateOrganizationMock).toBeCalledWith({
      data: {},
      where: { id: EXAMPLE_ORGANIZATION_ID }
    });
  });

  it('should invite a user', async () => {
    const res = await apolloClient.mutate({
      mutation: INVITE_USER_MUTATION,
      variables: { email: EXAMPLE_EMAIL }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      inviteUser: {
        ...EXAMPLE_USER,
        createdAt: EXAMPLE_USER.createdAt.toISOString(),
        updatedAt: EXAMPLE_USER.updatedAt.toISOString()
      }
    });
    expect(organizationServiceInviteUserMock).toBeCalledTimes(1);
    expect(organizationServiceInviteUserMock).toBeCalledWith(EXAMPLE_USER, {
      data: { email: EXAMPLE_EMAIL }
    });
  });
});
