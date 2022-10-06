import {
  Get,
  Param,
  Res,
  Controller,
  UseInterceptors,
  NotFoundException,
  BadRequestException,
  Body,
  Put
} from '@nestjs/common';
import { Response } from 'express';
import { MorganInterceptor } from 'nest-morgan';
import { BuildService } from './build.service';
import { BuildResultNotFound } from './errors/BuildResultNotFound';
import { BuildNotFoundError } from './errors/BuildNotFoundError';
import { StepNotCompleteError } from './errors/StepNotCompleteError';
import { StepNotFoundError } from './errors/StepNotFoundError';
import { CanUserAccessArgs } from './dto/CanUserAccessArgs';
import { plainToInstance } from 'class-transformer';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import {
  CHECK_USER_ACCESS_TOPIC,
  CREATE_PULL_REQUEST_COMPLETED_TOPIC
} from '../../constants';
import { KafkaMessage } from 'kafkajs';
import { ResultMessage } from '../queue/dto/ResultMessage';
import { StatusEnum } from '../queue/dto/StatusEnum';
import { EnvironmentVariables } from '@amplication/kafka';
import { ActionService } from '../action/action.service';
import { UpdateActionStepStatus } from './dto/UpdateActionStepStatus';
import { CompleteCodeGenerationStep } from './dto/CompleteCodeGenerationStep';
import { SendPullRequestResponse } from './dto/sendPullRequestResponse';

const ZIP_MIME = 'application/zip';
@Controller('generated-apps')
export class BuildController {
  constructor(
    private readonly buildService: BuildService,
    private readonly actionService: ActionService
  ) {}

  @Get(`/:id.zip`)
  @UseInterceptors(MorganInterceptor('combined'))
  async getGeneratedAppArchive(@Param('id') id: string, @Res() res: Response) {
    let stream: NodeJS.ReadableStream;
    try {
      stream = await this.buildService.download({ where: { id } });
    } catch (error) {
      if (error instanceof StepNotCompleteError) {
        throw new BadRequestException(error.message);
      }
      if (
        error instanceof BuildNotFoundError ||
        error instanceof BuildResultNotFound ||
        error instanceof StepNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
    res.set({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': ZIP_MIME,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Disposition': `attachment; filename="${id}.zip"`
    });
    stream.pipe(res);
  }

  @MessagePattern(
    EnvironmentVariables.instance.get(CHECK_USER_ACCESS_TOPIC, true)
  )
  async checkUserAccess(
    @Payload() message: KafkaMessage
  ): Promise<{ value: ResultMessage<boolean> }> {
    const validArgs = plainToInstance(CanUserAccessArgs, message.value);
    const isUserCanAccess = await this.buildService.canUserAccess(validArgs);
    return {
      value: { error: null, status: StatusEnum.Success, value: isUserCanAccess }
    };
  }

  //Authorization
  @Put('update-action-step-status')
  async updateStatus(@Body() dto: UpdateActionStepStatus): Promise<void> {
    await this.actionService.updateActionStepStatus(dto.id, dto.status);
  }

  //Authorization
  @Put('complete-code-generation-step')
  async completeCodeGenerationStep(
    @Body() dto: CompleteCodeGenerationStep
  ): Promise<void> {
    await this.buildService.completeCodeGenerationStep(dto.buildId, dto.status);
  }
  
  @EventPattern(
    EnvironmentVariables.instance.get(CREATE_PULL_REQUEST_COMPLETED_TOPIC, true)
  )
  async onPullRequestCreated(@Payload() message: KafkaMessage) {
    const args = plainToInstance(SendPullRequestResponse, message.value);
    await this.buildService.onPullRequestCreated(args);
  }
}
