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
import { BlockResolver } from './block.resolver';
import { BlockService } from './block.service';
import { Block, BlockVersion, User } from 'src/models';
import { EnumBlockType } from '@prisma/client';

const EXAMPLE_USER_ID = 'exampleUserId';
const EXAMPLE_BLOCK_ID = 'exampleBlockId';
const EXAMPLE_APP_ID = 'exampleAppId';
const EXAMPLE_DISPLAY_NAME = 'exampleDisplayName';
const EXAMPLE_BLOCK_VERSION_ID = 'exampleBlockVersionId';
const EXAMPLE_VERSION_NUMBER = 1;
const EXAMPLE_LABEL = 'exampleLabel';

const EXAMPLE_BLOCK: Block = {
  id: EXAMPLE_BLOCK_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  appId: EXAMPLE_APP_ID,
  displayName: EXAMPLE_DISPLAY_NAME,
  blockType: EnumBlockType.ConnectorRestApi
};

const EXAMPLE_BLOCK_VERSION: BlockVersion = {
  id: EXAMPLE_BLOCK_VERSION_ID,
  versionNumber: EXAMPLE_VERSION_NUMBER,
  label: EXAMPLE_LABEL,
  createdAt: new Date(),
  updatedAt: new Date()
};

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date()
};

const CREATE_BLOCK_VERSION_MUTATION = gql`
  mutation($label: String!, $blockId: String!) {
    createBlockVersion(
      data: { label: $label, block: { connect: { id: $blockId } } }
    ) {
      id
      versionNumber
      createdAt
      updatedAt
      label
    }
  }
`;

const createVersionMock = jest.fn(() => EXAMPLE_BLOCK_VERSION);

const mockCanActivate = jest.fn(mockGqlAuthGuardCanActivate(EXAMPLE_USER));

describe('BlockResolver', () => {
  let app: INestApplication;
  let apolloClient: ApolloServerTestClient;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        BlockResolver,
        {
          provide: BlockService,
          useClass: jest.fn(() => ({
            createVersion: createVersionMock
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

  it('should create a Block Version', async () => {
    const res = await apolloClient.mutate({
      mutation: CREATE_BLOCK_VERSION_MUTATION,
      variables: { label: EXAMPLE_LABEL, blockId: EXAMPLE_BLOCK_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      createBlockVersion: {
        ...EXAMPLE_BLOCK_VERSION,
        createdAt: EXAMPLE_BLOCK_VERSION.createdAt.toISOString(),
        updatedAt: EXAMPLE_BLOCK_VERSION.updatedAt.toISOString()
      }
    });
  });
});
