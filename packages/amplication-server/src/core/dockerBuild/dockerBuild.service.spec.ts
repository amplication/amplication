import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CloudBuildService } from './cloudBuild.service';
import {
  APPS_GCP_PROJECT_ID_VAR,
  createCloudBuildConfig,
  DockerBuildService,
  IMAGE_REPOSITORY_SUBSTITUTION_KEY,
  IMAGE_TAG_SUBSTITUTION_KEY
} from './dockerBuild.service';
import baseCloudBuildConfig from './base-cloud-build-config.json';

const EXAMPLE_APPS_GCP_PROJECT_ID = 'EXAMPLE_APPS_GCP_PROJECT_ID';
const EXAMPLE_REPOSITORY = 'EXAMPLE_REPOSITORY';
const EXAMPLE_TAG = 'EXAMPLE_TAG';
const EXAMPLE_BUCKET = 'EXAMPLE_BUCKET';
const EXAMPLE_OBJECT = 'EXAMPLE_OBJECT';
const EXAMPLE_CODE_URL = `https://storage.cloud.google.com/${EXAMPLE_BUCKET}/${EXAMPLE_OBJECT}`;
const EXAMPLE_IMAGES = [`${EXAMPLE_REPOSITORY}:${EXAMPLE_TAG}`];
const EXAMPLE_CLOUD_BUILD_FINISHED_BUILD = {
  images: EXAMPLE_IMAGES
};
const EXAMPLE_CLOUD_BUILD_BUILD = {
  async promise() {
    return [EXAMPLE_CLOUD_BUILD_FINISHED_BUILD];
  }
};

const configServiceGetMock = jest.fn(() => EXAMPLE_APPS_GCP_PROJECT_ID);
const cloudBuildServiceBuildMock = jest.fn(() => [EXAMPLE_CLOUD_BUILD_BUILD]);

describe('DockerBuildService', () => {
  let service: DockerBuildService;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DockerBuildService,
        {
          provide: ConfigService,
          useClass: jest.fn(() => ({
            get: configServiceGetMock
          }))
        },
        {
          provide: CloudBuildService,
          useClass: jest.fn(() => ({
            createBuild: cloudBuildServiceBuildMock
          }))
        }
      ]
    }).compile();

    service = module.get<DockerBuildService>(DockerBuildService);
  });
  test('builds docker image', async () => {
    await expect(
      service.build(EXAMPLE_REPOSITORY, EXAMPLE_TAG, EXAMPLE_CODE_URL)
    ).resolves.toEqual({ images: EXAMPLE_IMAGES });
    expect(configServiceGetMock).toBeCalledTimes(1);
    expect(configServiceGetMock).toBeCalledWith(APPS_GCP_PROJECT_ID_VAR);
    expect(cloudBuildServiceBuildMock).toBeCalledTimes(1);
    expect(cloudBuildServiceBuildMock).toBeCalledWith({
      projectId: EXAMPLE_APPS_GCP_PROJECT_ID,
      build: createCloudBuildConfig(
        EXAMPLE_REPOSITORY,
        EXAMPLE_TAG,
        EXAMPLE_CODE_URL
      )
    });
  });
});

describe('createCloudBuildConfig', () => {
  test('creates cloud build config', () => {
    expect(
      createCloudBuildConfig(EXAMPLE_REPOSITORY, EXAMPLE_TAG, EXAMPLE_CODE_URL)
    ).toEqual({
      ...baseCloudBuildConfig,
      source: {
        storageSource: {
          bucket: EXAMPLE_BUCKET,
          object: EXAMPLE_OBJECT
        }
      },
      substitutions: {
        /** @todo use a nicer repository name */
        [IMAGE_REPOSITORY_SUBSTITUTION_KEY]: EXAMPLE_REPOSITORY,
        [IMAGE_TAG_SUBSTITUTION_KEY]: EXAMPLE_TAG
      }
    });
  });
});
