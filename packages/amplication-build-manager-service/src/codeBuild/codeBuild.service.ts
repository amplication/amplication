import {
  CodeBuildClient,
  StartBuildCommand,
  StartBuildCommandInput,
} from '@aws-sdk/client-codebuild';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CODE_BUILD_PROJECT_NAME } from 'src/constants';

@Injectable()
export class CodeBuildService {
  private readonly codeBuildClient: CodeBuildClient;
  private readonly projectName: string;

  constructor(private readonly configService: ConfigService) {
    //TODO: Provide credentials
    this.codeBuildClient = new CodeBuildClient({
      // credentials: {
      //   accessKeyId: configService.get('AWS_KEY_ID'),
      //   secretAccessKey: configService.get('AWS_SECRET_KEY'),
      // },
    });
    this.projectName = this.configService.get<string>(CODE_BUILD_PROJECT_NAME);
  }

  async runBuild(contextArchivePath: string) {
    const sbci: StartBuildCommandInput = {
      projectName: this.projectName,
      sourceLocationOverride: contextArchivePath,
    };

    const sbc = new StartBuildCommand(sbci);

    try {
      await this.codeBuildClient.send(sbc);
    } catch (err) {
      console.log(err);
    }
  }
}
