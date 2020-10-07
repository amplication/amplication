import {
  Controller,
  UseInterceptors,
  Post,
  Body,
  UseGuards
} from '@nestjs/common';
import { MorganInterceptor } from 'nest-morgan';
import { DeploymentService } from './deployment.service';
import { CreateDeploymentDTO } from './dto/CreateDeploymentDTO';
import { BackgroundAuthGuard } from '../background/background-auth.guard';

@Controller('publish-apps')
@UseInterceptors(MorganInterceptor('combined'))
export class DeploymentController {
  constructor(private readonly deploymentService: DeploymentService) {}

  @Post('/')
  @UseGuards(BackgroundAuthGuard)
  async createDeployment(@Body() body: CreateDeploymentDTO) {
    await this.deploymentService.deploy(body.deploymentId);
  }
}
