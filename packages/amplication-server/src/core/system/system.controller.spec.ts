import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { MorganModule } from 'nest-morgan';
import { BuildService } from '../build/build.service';
import { SystemController } from './system.controller';
import { DeploymentService } from '../deployment/deployment.service';
import request from 'supertest';

describe('SystemController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      imports: [MorganModule.forRoot()],
      providers: [
        {
          provide: BuildService,
          useClass: jest.fn(() => ({}))
        },
        {
          provide: DeploymentService,
          useClass: jest.fn(() => ({}))
        }
      ],
      controllers: [SystemController]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('should update statuses', async () => {
    console.log(app.getHttpServer());
    await request(app.getHttpServer())
      .post('system/update-statuses')
      .expect(HttpStatus.OK);
  });
});
