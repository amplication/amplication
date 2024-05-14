import { Injectable } from "@nestjs/common";
import {
  ECRClient,
  DescribeImagesCommand,
  DescribeImagesCommandInput,
  ImageDetail,
  DescribeRepositoriesCommand,
  Repository,
} from "@aws-sdk/client-ecr";
import { Traceable } from "@amplication/opentelemetry-nestjs";

@Traceable()
@Injectable()
export class AwsEcrService {
  private client: ECRClient;
  private versionPattern = /v\d+\.\d+\.\d+/;

  constructor() {
    this.client = new ECRClient({
      region: "us-east-1",
    });
  }

  async getTags(
    name = "data-service-generator",
    nextToken?: string
  ): Promise<ImageDetail[]> {
    const input = <DescribeImagesCommandInput>{
      repositoryName: name,
      filter: {
        tagStatus: "TAGGED",
      },
      maxResults: 100,
      nextToken,
    };
    const command = new DescribeImagesCommand(input);
    const response = await this.client.send(command);

    const images: ImageDetail[] =
      response.imageDetails
        ?.filter((image) =>
          image.imageTags?.some((tag) => tag.match(this.versionPattern))
        )
        .map((image) => ({
          ...image,
          imageTags: image.imageTags?.filter((tag) =>
            tag.match(this.versionPattern)
          ),
        })) || [];

    if (response.nextToken) {
      images.push(...(await this.getTags(name, response.nextToken)));
    }

    return images;
  }

  async getGeneratorImages(nextToken?: string): Promise<string[]> {
    const command = new DescribeRepositoriesCommand({
      repositoryNames: [],
      maxResults: 100,
      nextToken,
    });
    const response = await this.client.send(command);

    const repositories: Repository[] =
      response.repositories?.filter((repository) =>
        repository.repositoryName.startsWith("generator-")
      ) || [];

    const repositoriesNames = repositories.map(
      (repository) => repository.repositoryName
    );

    if (response.nextToken) {
      repositoriesNames.push(
        ...(await this.getGeneratorImages(response.nextToken))
      );
    }

    return repositoriesNames;
  }
}
