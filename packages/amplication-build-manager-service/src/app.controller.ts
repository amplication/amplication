import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import fs from 'fs';
import { BuildContextStorageService } from './buildContextStorage/buildContextStorage.service';
import { CodeBuildService } from './codeBuild/codeBuild.service';
import { GenerateResource } from './codeBuild/dto/GenerateResource';

@Controller()
export class AppController {
  constructor(
    private readonly codeBuildService: CodeBuildService,
    private readonly buildContextStorage: BuildContextStorageService,
  ) {}

  @MessagePattern('build.internal.generate-resource.event.0')
  async receiveCodeGenRequest(@Payload() message: any) {
    const gr: GenerateResource = message.value;

    const path = await this.buildContextStorage.saveBuildContextSource(gr);

    await this.codeBuildService.runBuild(path);
  }
}
