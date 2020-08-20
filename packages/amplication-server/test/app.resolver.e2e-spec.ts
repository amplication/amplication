import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ExecutionContext } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from './../src/app.module';
import { print } from 'graphql';
import { gql } from 'apollo-server-express';
import { PermissionsService } from 'src/core/permissions/permissions.service';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { GqlExecutionContext } from '@nestjs/graphql';

const CREATE_BUILD_MUTATION = gql`
  mutation($app: String!) {
    createBuild(data: { app: { connect: { id: $app } } }) {
      id
      createdAt
      app {
        id
      }
      createdBy {
        id
      }
      status
    }
  }
`;

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const permissionsService = {
    validateAccess: () => true
  };
  const gqlAuthGuard = {
    canActivate: (context: ExecutionContext) => {
      const ctx = GqlExecutionContext.create(context);
      const { req } = ctx.getContext();
      req.user = {
        id: 'ExampleUserId'
      };
      return true;
    }
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideGuard(GqlAuthGuard)
      .useValue(gqlAuthGuard)
      .overrideProvider(PermissionsService)
      .useValue(permissionsService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('creates a build', async () => {
    const appId = '';
    await request(app.getHttpServer())
      .post('/graphql')
      .type('form')
      .send({ query: print(CREATE_BUILD_MUTATION), variables: { app: appId } })
      .expect(200)
      .expect({
        errors: [],
        data: {
          id: expect.any(String),
          createdAt: expect.any(Date),
          app: {
            id: appId
          },
          createdBy: {
            id: expect.any(Date)
          },
          status: expect.any(String)
        }
      });
  });
});
