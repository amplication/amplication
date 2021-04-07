import { Post, Controller, UseInterceptors } from '@nestjs/common';
import { MorganInterceptor } from 'nest-morgan';
import { BuildService } from '../build/build.service';
import { DeploymentService } from '../deployment/deployment.service';

@Controller('system')
export class SystemController {
  constructor(
    private readonly buildService: BuildService,
    private readonly deploymentService: DeploymentService
  ) {}

  @Post('update-statuses')
  @UseInterceptors(MorganInterceptor('combined'))
  async updateStatuses() {
    await Promise.all([
      this.buildService.updateRunningBuildsStatus(),
      this.deploymentService.updateRunningDeploymentsStatus(),
      this.deploymentService.destroyStaledDeployments()
    ]);
  }
}
