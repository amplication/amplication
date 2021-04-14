import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { MorganModule } from 'nest-morgan';
import { BuildService } from '../build/build.service';
import { SystemController } from './system.controller';
import { DeploymentService } from '../deployment/deployment.service';
import request from 'supertest';

const mockUpdateRunningBuildsStatus = jest.fn();
const mockUpdateRunningDeploymentsStatus = jest.fn();
const mockDestroyStaledDeployments = jest.fn();

describe('SystemController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      imports: [MorganModule.forRoot()],
      providers: [
        {
          provide: BuildService,
          useClass: jest.fn(() => ({
            updateRunningBuildsStatus: mockUpdateRunningBuildsStatus
          }))
        },
        {
          provide: DeploymentService,
          useClass: jest.fn(() => ({
            updateRunningDeploymentsStatus: mockUpdateRunningDeploymentsStatus,
            destroyStaledDeployments: mockDestroyStaledDeployments
          }))
        }
      ],
      controllers: [SystemController]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('should update statuses', async () => {
    await request(app.getHttpServer())
      .post('/system/update-statuses')
      .expect(HttpStatus.CREATED);
    expect(mockUpdateRunningBuildsStatus).toBeCalledTimes(1);
    expect(mockUpdateRunningBuildsStatus).toBeCalledWith();
    expect(mockUpdateRunningDeploymentsStatus).toBeCalledTimes(1);
    expect(mockUpdateRunningDeploymentsStatus).toBeCalledWith();
  });
});
