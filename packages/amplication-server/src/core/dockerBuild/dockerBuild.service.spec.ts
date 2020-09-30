import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CloudBuildService } from './cloudBuild.service';
import {
  APPS_GCP_PROJECT_ID_VAR,
  createCloudBuildConfig,
  createLocalImageId,
  DockerBuildProvider,
  DockerBuildService,
  DOCKER_BUILD_PROVIDER_VAR,
  IMAGE_REPOSITORY_SUBSTITUTION_KEY,
  IMAGE_TAG_SUBSTITUTION_KEY
} from './dockerBuild.service';
import baseCloudBuildConfig from './base-cloud-build-config.json';
import { DockerService } from './docker.service';
import { GCS_HOST } from './gcs.util';

const EXAMPLE_APPS_GCP_PROJECT_ID = 'EXAMPLE_APPS_GCP_PROJECT_ID';
const EXAMPLE_REPOSITORY = 'EXAMPLE_REPOSITORY';
const EXAMPLE_TAG = 'EXAMPLE_TAG';
const EXAMPLE_BUCKET = 'EXAMPLE_BUCKET';
const EXAMPLE_OBJECT = 'EXAMPLE_OBJECT';
const EXAMPLE_GCS_CODE_URL = `https://${GCS_HOST}/${EXAMPLE_BUCKET}/${EXAMPLE_OBJECT}`;
const EXAMPLE_LOCAL_CODE_URL = `/example-directory/example-filename`;
const EXAMPLE_IMAGES = [
  `example.com/example/${EXAMPLE_REPOSITORY}:${EXAMPLE_TAG}`
];
const EXAMPLE_CLOUD_BUILD_FINISHED_BUILD = {
  images: EXAMPLE_IMAGES
};
const EXAMPLE_CLOUD_BUILD_BUILD = {
  async promise() {
    return [EXAMPLE_CLOUD_BUILD_FINISHED_BUILD];
  }
};

const configServiceGetMock = jest.fn();
const cloudBuildServiceBuildMock = jest.fn(() => [EXAMPLE_CLOUD_BUILD_BUILD]);
const dockerServiceBuildImageMock = jest.fn();

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
        },
        {
          provide: DockerService,
          useClass: jest.fn(() => ({
            buildImage: dockerServiceBuildImageMock
          }))
        }
      ]
    }).compile();

    service = module.get<DockerBuildService>(DockerBuildService);
  });
  test('builds docker image using local docker server', async () => {
    configServiceGetMock.mockImplementation((name: string) => {
      switch (name) {
        case DOCKER_BUILD_PROVIDER_VAR:
          return DockerBuildProvider.Local;
      }
    });
    await expect(
      service.build(EXAMPLE_REPOSITORY, EXAMPLE_TAG, EXAMPLE_LOCAL_CODE_URL)
    ).resolves.toEqual({ images: EXAMPLE_IMAGES });
    expect(configServiceGetMock).toBeCalledTimes(1);
    expect(configServiceGetMock).toBeCalledWith(DOCKER_BUILD_PROVIDER_VAR);
    expect(dockerServiceBuildImageMock).toBeCalledTimes(1);
    expect(dockerServiceBuildImageMock).toBeCalledWith(EXAMPLE_LOCAL_CODE_URL, {
      t: createLocalImageId(EXAMPLE_REPOSITORY, EXAMPLE_TAG)
    });
  });
  test('builds docker image using google cloud build', async () => {
    configServiceGetMock.mockImplementation((name: string) => {
      switch (name) {
        case DOCKER_BUILD_PROVIDER_VAR:
          return DockerBuildProvider.GoogleCloudBuild;
        case APPS_GCP_PROJECT_ID_VAR:
          return EXAMPLE_APPS_GCP_PROJECT_ID;
      }
    });
    await expect(
      service.build(EXAMPLE_REPOSITORY, EXAMPLE_TAG, EXAMPLE_GCS_CODE_URL)
    ).resolves.toEqual({ images: EXAMPLE_IMAGES });
    expect(configServiceGetMock).toBeCalledTimes(2);
    expect(configServiceGetMock.mock.calls).toEqual([
      [DOCKER_BUILD_PROVIDER_VAR],
      [APPS_GCP_PROJECT_ID_VAR]
    ]);
    expect(cloudBuildServiceBuildMock).toBeCalledTimes(1);
    expect(cloudBuildServiceBuildMock).toBeCalledWith({
      projectId: EXAMPLE_APPS_GCP_PROJECT_ID,
      build: createCloudBuildConfig(
        EXAMPLE_REPOSITORY,
        EXAMPLE_TAG,
        EXAMPLE_GCS_CODE_URL
      )
    });
  });
});

describe('createCloudBuildConfig', () => {
  test('creates cloud build config', () => {
    expect(
      createCloudBuildConfig(
        EXAMPLE_REPOSITORY,
        EXAMPLE_TAG,
        EXAMPLE_GCS_CODE_URL
      )
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
