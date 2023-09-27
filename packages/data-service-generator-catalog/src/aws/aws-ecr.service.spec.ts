import { Test, TestingModule } from "@nestjs/testing";
import { AwsEcrService } from "./aws-ecr.service";

import { mockClient } from "aws-sdk-client-mock";
import {
  ECRClient,
  DescribeImagesCommand,
  ImageDetail,
} from "@aws-sdk/client-ecr";

describe("AwsEcrService", () => {
  let service: AwsEcrService;

  const awsClientMock = mockClient(ECRClient);

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [AwsEcrService],
    }).compile();

    service = module.get<AwsEcrService>(AwsEcrService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getTags", () => {
    beforeEach(() => {
      awsClientMock
        .on(DescribeImagesCommand, {
          repositoryName: "data-service-generator",
          filter: {
            tagStatus: "TAGGED",
          },
          maxResults: 100,
          nextToken: undefined,
        })
        .resolves({
          imageDetails: [
            {
              imageTags: ["v1.0.0"],
            },
            {
              imageTags: ["v1.0.1", "dev"],
            },
            {
              imageTags: ["v1.0.2"],
            },
          ],
          nextToken: "a-token",
        })
        .on(DescribeImagesCommand, {
          repositoryName: "data-service-generator",
          filter: {
            tagStatus: "TAGGED",
          },
          maxResults: 100,
          nextToken: "a-token",
        })
        .resolves({
          imageDetails: [
            {
              imageTags: ["v2.0.0"],
            },
          ],
        });
    });
    it("should return tags without dev image tags", async () => {
      const tags = await service.getTags();
      expect(tags).toEqual([
        {
          imageTags: ["v1.0.0"],
        },
        {
          imageTags: ["v1.0.1"],
        },
        {
          imageTags: ["v1.0.2"],
        },
        {
          imageTags: ["v2.0.0"],
        },
      ]);
    });
  });
});
