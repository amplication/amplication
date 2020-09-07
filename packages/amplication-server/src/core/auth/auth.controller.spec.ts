import * as https from 'https';
import request from 'supertest';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MorganModule } from 'nest-morgan';
import { AuthController } from './auth.controller';
import { GitHubStrategyConfigService } from './githubStrategyConfig.service';

jest.mock('https');

const EXAMPLE_CODE = 'EXAMPLE_CODE';

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
    https.request.mockImplementation((options, callback) => {
      setImmediate(() => {
        callback({
          pipe(stream) {
            stream.write(EXAMPLE_CODE);
          },
          on(type, callback) {
            callback();
          },
          statusCode: HttpStatus.CREATED
        });
      });
      return {
        write(data) {
          return;
        },
        end() {
          return;
        }
      };
    });
    await request(app.getHttpServer())
      .post('/github/login/oauth/access_token')
      .send({
        // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/camelcase
        client_id: 'example_client_id',
        code: 'example_code',
        // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/camelcase
        redirect_uri: 'example_redirect_uri',
        state: 'example_state'
      })
      .expect(HttpStatus.CREATED)
      .expect(EXAMPLE_CODE);
  });
});
