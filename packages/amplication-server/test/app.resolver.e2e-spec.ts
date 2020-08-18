import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from './../src/app.module';
import { gql } from 'apollo-server-express';

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

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('creates a build', () => {
    const appId = '';
    return request(app.getHttpServer())
      .post('/graphql')
      .type('form')
      .send({ query: CREATE_BUILD_MUTATION, variables: { app: appId } })
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
