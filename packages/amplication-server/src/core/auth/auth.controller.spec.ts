import axios from 'axios';
import request from 'supertest';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MorganModule } from 'nest-morgan';
import { AuthController } from './auth.controller';
import { GitHubStrategyConfigService } from './githubStrategyConfig.service';

jest.mock('axios');

const EXAMPLE_CLIENT_ID = 'EXAMPLE_CLIENT_ID';
const EXAMPLE_CODE = 'EXAMPLE_CODE';
const EXAMPLE_REDIRECT_URI = 'EXAMPLE_REDIRECT_URI';
const EXAMPLE_STATE = 'EXAMPLE_STATE';
const EXAMPLE_ACCESS_TOKEN = 'EXAMPLE_ACCESS_TOKEN';

describe('BuildController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      imports: [MorganModule.forRoot()],
      providers: [
        {
          provide: GitHubStrategyConfigService,
          useValue: {
            getOptions() {
              return {
                clientSecret: 'EXAMPLE_SECRET'
              };
            }
          }
        }
      ],
      controllers: [AuthController]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  test('create access token', async () => {
    // eslint-disable-next-line
    // @ts-ignore
    axios.post.mockImplementation(() => ({
      status: HttpStatus.CREATED,
      headers: {},
      data: EXAMPLE_ACCESS_TOKEN
    }));
    await request(app.getHttpServer())
      .post('/github/login/oauth/access_token')
      .send({
        // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/camelcase
        client_id: EXAMPLE_CLIENT_ID,
        code: EXAMPLE_CODE,
        // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/camelcase
        redirect_uri: EXAMPLE_REDIRECT_URI,
        state: EXAMPLE_STATE
      })
      .expect(HttpStatus.CREATED)
      .expect(EXAMPLE_ACCESS_TOKEN);
  });
});
