import { Test, TestingModule } from "@nestjs/testing";
import { AwsEcrService } from "./aws-ecr.service";
import { ConfigService } from "@nestjs/config";

import { mockClient } from "aws-sdk-client-mock";
import { ECRClient, ListImagesCommand } from "@aws-sdk/client-ecr";

describe("AwsEcrService", () => {
  let service: AwsEcrService;
  const mockGetConfigService = jest.fn().mockImplementation((variable) => {
    switch (variable) {
      case "INCLUDE_DEV_VERSIONS":
        return "0";
      default:
        return "";
    }
  });
  const awsClientMock = mockClient(ECRClient);

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: mockGetConfigService,
          },
        },
        AwsEcrService,
      ],
    }).compile();

    service = module.get<AwsEcrService>(AwsEcrService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getTags", () => {
    beforeEach(() => {
      awsClientMock
        .on(ListImagesCommand, {
          repositoryName: "data-service-generator",
          filter: {
            tagStatus: "TAGGED",
          },
          maxResults: 500,
          nextToken: undefined,
        })
        .resolves({
          imageIds: [
            {
              imageTag: "v1.0.0",
            },
            {
              imageTag: "v1.0.1",
            },
            {
              imageTag: "v1.0.2",
            },
          ],
          nextToken: "a-token",
        })
        .on(ListImagesCommand, {
          repositoryName: "data-service-generator",
          filter: {
            tagStatus: "TAGGED",
          },
          maxResults: 500,
          nextToken: "a-token",
        })
        .resolves({
          imageIds: [
            {
              imageTag: "v2.0.0",
            },
          ],
        });
    });
    it("should return tags without dev image tags", async () => {
      const tags = await service.getTags();
      expect(tags).toEqual(["v1.0.0", "v1.0.1", "v1.0.2", "v2.0.0"]);
    });
  });
});
