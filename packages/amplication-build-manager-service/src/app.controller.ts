import { EnvironmentVariables } from '@amplication/kafka';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { BuildContextStorageService } from './buildContextStorage/buildContextStorage.service';
import { CodeBuildService } from './codeBuild/codeBuild.service';
import { GenerateResource } from './codeBuild/dto/GenerateResource';
import { GENERATE_RESOURCE_TOPIC } from './constants';

@Controller()
export class AppController {
  constructor(
    private readonly codeBuildService: CodeBuildService,
    private readonly buildContextStorage: BuildContextStorageService,
  ) {}

  @EventPattern(
    EnvironmentVariables.instance.get(GENERATE_RESOURCE_TOPIC, true),
  )
  async receiveCodeGenRequest(@Payload() message: any) {
    const gr: GenerateResource = message.value;
    const path = await this.buildContextStorage.saveBuildContextSource(gr);
    await this.codeBuildService.runBuild(path);
  }
}
