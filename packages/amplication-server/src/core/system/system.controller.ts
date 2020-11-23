import { Post, Controller, UseInterceptors } from '@nestjs/common';
import { MorganInterceptor } from 'nest-morgan';
import { BuildService } from '../build/build.service';

@Controller('system')
export class SystemController {
  constructor(private readonly buildService: BuildService) {}

  @Post('update-statuses')
  @UseInterceptors(MorganInterceptor('combined'))
  async updateStatuses() {
    await this.buildService.updateRunningBuildsStatus();
  }
}
