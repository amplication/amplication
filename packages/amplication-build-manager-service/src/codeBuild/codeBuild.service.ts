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
    this.codeBuildClient = new CodeBuildClient({});
    this.projectName = this.configService.get<string>(CODE_BUILD_PROJECT_NAME);
  }

  async runBuild(contextArchivePath: string) {
    const input: StartBuildCommandInput = {
      projectName: this.projectName,
      sourceLocationOverride: contextArchivePath,
    };

    const command = new StartBuildCommand(input);

    try {
      await this.codeBuildClient.send(command);
    } catch (err) {
      console.log(err);
    }
  }
}
