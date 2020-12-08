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
import { CommitService } from './commit.service';
import { Commit, User } from 'src/models';
import { UserService } from '../user/user.service';
import { BuildService } from '../build/build.service';

import { CommitResolver } from './commit.resolver';

const EXAMPLE_COMMIT_ID = 'exampleCommitId';
const EXAMPLE_USER_ID = 'exampleUserId';
const EXAMPLE_MESSAGE = 'exampleMessage';

const EXAMPLE_COMMIT: Commit = {
  id: EXAMPLE_COMMIT_ID,
  userId: EXAMPLE_USER_ID,
  message: EXAMPLE_MESSAGE,
  createdAt: new Date()
};

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date()
};

const USER_QUERY = gql`
  query($id: String!) {
    commit(where: { id: $id }) {
      user {
        id
        createdAt
        updatedAt
      }
    }
  }
`;

const FIND_ONE_COMMIT_QUERY = gql`
  query($id: String!) {
    commit(where: { id: $id }) {
      id
      userId
      message
      createdAt
    }
  }
`;

const FIND_MANY_COMMIT_QUERY = gql`
  query {
    commits {
      id
      userId
      message
      createdAt
    }
  }
`;

const commitServiceFindOneMock = jest.fn(() => EXAMPLE_COMMIT);
const commitServiceFindManyMock = jest.fn(() => [EXAMPLE_COMMIT]);

const userServiceFindUserMock = jest.fn(() => EXAMPLE_USER);

const mockCanActivate = jest.fn(() => true);

describe('CommitService', () => {
  let app: INestApplication;
  let apolloClient: ApolloServerTestClient;

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        CommitResolver,
        {
          provide: CommitService,
          useClass: jest.fn(() => ({
            findOne: commitServiceFindOneMock,
            findMany: commitServiceFindManyMock
          }))
        },
        {
          provide: UserService,
          useClass: jest.fn(() => ({
            findUser: userServiceFindUserMock
          }))
        },
        {
          provide: BuildService,
          useValue: {}
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

  it('should find committing user', async () => {
    const res = await apolloClient.query({
      query: USER_QUERY,
      variables: {
        id: EXAMPLE_COMMIT_ID
      }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      commit: {
        user: {
          ...EXAMPLE_USER,
          createdAt: EXAMPLE_USER.createdAt.toISOString(),
          updatedAt: EXAMPLE_USER.updatedAt.toISOString()
        }
      }
    });
    expect(userServiceFindUserMock).toBeCalledTimes(1);
    expect(userServiceFindUserMock).toBeCalledWith({
      where: { id: EXAMPLE_USER_ID }
    });
  });

  it('should find one Commit', async () => {
    const res = await apolloClient.query({
      query: FIND_ONE_COMMIT_QUERY,
      variables: { id: EXAMPLE_COMMIT_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      commit: {
        ...EXAMPLE_COMMIT,
        createdAt: EXAMPLE_COMMIT.createdAt.toISOString()
      }
    });
    expect(commitServiceFindOneMock).toBeCalledTimes(1);
    expect(commitServiceFindOneMock).toBeCalledWith({
      where: { id: EXAMPLE_COMMIT_ID }
    });
  });

  it('should find many Commits', async () => {
    const res = await apolloClient.query({
      query: FIND_MANY_COMMIT_QUERY,
      variables: {}
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      commits: [
        {
          ...EXAMPLE_COMMIT,
          createdAt: EXAMPLE_COMMIT.createdAt.toISOString()
        }
      ]
    });
    expect(commitServiceFindManyMock).toBeCalledTimes(1);
    expect(commitServiceFindManyMock).toBeCalledWith({});
  });
});
