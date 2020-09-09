import axios from 'axios';
import request from 'supertest';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MorganModule } from 'nest-morgan';
import {
  AuthController,
  CLIENT_SECRET_PARAM,
  GITHUB_ACCESS_TOKEN_URL
} from './auth.controller';
import { GitHubStrategyConfigService } from './githubStrategyConfig.service';

jest.mock('axios');

const EXAMPLE_CLIENT_ID = 'EXAMPLE_CLIENT_ID';
const EXAMPLE_CODE = 'EXAMPLE_CODE';
const EXAMPLE_REDIRECT_URI = 'EXAMPLE_REDIRECT_URI';
const EXAMPLE_STATE = 'EXAMPLE_STATE';
const EXAMPLE_ACCESS_TOKEN = 'EXAMPLE_ACCESS_TOKEN';
const EXAMPLE_CLIENT_SECRET = 'EXAMPLE_CLIENT_SECRET';

const getOptionsMock = jest.fn(() => ({
  clientSecret: EXAMPLE_CLIENT_SECRET
}));

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
            getOptions: getOptionsMock
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
    const params = {
      // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/camelcase
      client_id: EXAMPLE_CLIENT_ID,
      code: EXAMPLE_CODE,
      // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/camelcase
      redirect_uri: EXAMPLE_REDIRECT_URI,
      state: EXAMPLE_STATE
    };
    await request(app.getHttpServer())
      .post('/github/login/oauth/access_token')
      .send(params)
      .expect(HttpStatus.CREATED)
      .expect(EXAMPLE_ACCESS_TOKEN);
    expect(getOptionsMock).toBeCalledTimes(1);
    expect(getOptionsMock).toBeCalledWith();
    expect(axios.post).toBeCalledTimes(1);
    expect(axios.post).toBeCalledWith(GITHUB_ACCESS_TOKEN_URL, {
      headers: expect.any(Object),
      data: new URLSearchParams({
        ...params,
        [CLIENT_SECRET_PARAM]: EXAMPLE_CLIENT_SECRET
      })
    });
  });
});
