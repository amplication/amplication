import { EnvironmentVariables } from '@amplication/kafka';
import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { BuildContextStorageService } from './buildContextStorage/buildContextStorage.service';
import { BuildService } from './codeBuild/build.service';
import { CODE_BUILD_SERVICE } from './codeBuild/codeBuild.module';
import { GenerateResource } from './codeBuild/dto/GenerateResource';
import { GENERATE_RESOURCE_TOPIC } from './constants';

@Controller()
export class AppController {
  constructor(
    @Inject(CODE_BUILD_SERVICE) private readonly buildService: BuildService,
    private readonly buildContextStorage: BuildContextStorageService,
  ) {}

  @EventPattern(
    EnvironmentVariables.instance.get(GENERATE_RESOURCE_TOPIC, true),
  )
  async receiveCodeGenRequest(@Payload() message: any) {
    try {
      const gr: GenerateResource = message.value;
      const path = await this.buildContextStorage.saveBuildContextSource(gr);
      await this.buildService.runBuild(path);
    } catch (error) {
      console.error(error);
    }
  }
}
