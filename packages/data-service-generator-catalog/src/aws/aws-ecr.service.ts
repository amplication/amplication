import { Injectable } from "@nestjs/common";
import {
  ECRClient,
  ListImagesCommand,
  ListImagesCommandInput,
} from "@aws-sdk/client-ecr";
import { Traceable } from "@amplication/opentelemetry-nestjs";
import { ConfigService } from "@nestjs/config";

@Traceable()
@Injectable()
export class AwsEcrService {
  private client: ECRClient;
  private versionPattern = /v\d+\.\d+\.\d+/;

  constructor(private readonly configService: ConfigService) {
    this.client = new ECRClient();
  }

  async getTags(nextToken?: string): Promise<string[]> {
    const input = <ListImagesCommandInput>{
      repositoryName: "data-service-generator",
      filter: {
        tagStatus: "TAGGED",
      },
      maxResults: 500,
      nextToken,
    };
    const command = new ListImagesCommand(input);
    const response = await this.client.send(command);

    const tags =
      response.imageIds
        ?.filter((image) => image.imageTag.match(this.versionPattern))
        .map((image) => image.imageTag) || [];

    if (response.nextToken) {
      tags.push(...(await this.getTags(response.nextToken)));
    }

    return tags;
  }
}
