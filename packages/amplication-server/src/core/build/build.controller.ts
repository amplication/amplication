import {
  Get,
  Param,
  Res,
  Controller,
  UseInterceptors,
  NotFoundException,
  BadRequestException,
  Inject,
  LoggerService
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
import { BUILD_STATUS_TOPIC, CHECK_USER_ACCESS_TOPIC } from '../../constants';
import { KafkaMessage } from 'kafkajs';
import { ResultMessage } from '../queue/dto/ResultMessage';
import { StatusEnum } from '../queue/dto/StatusEnum';
import { EnvironmentVariables } from '@amplication/kafka';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { EnumBuildStatus } from './dto/EnumBuildStatus';
import { ActionService } from '../action/action.service';

const ZIP_MIME = 'application/zip';
@Controller('generated-apps')
export class BuildController {
  constructor(
    private readonly buildService: BuildService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
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

  @EventPattern(EnvironmentVariables.instance.get(BUILD_STATUS_TOPIC, true))
  async onBuildStatus(@Payload() message): Promise<void> {
    const { buildId, runId, status } = message.value;
    try {
      switch (status) {
        case 'INIT':
          await this.buildService.onBuildInit(buildId, runId);
          break;
        case 'IN_PROGRESS':
          await this.buildService.updateStateByRunId(
            runId,
            EnumBuildStatus.InProgress
          );
          break;
        case 'SUCCEEDED':
          await this.buildService.updateStateByRunId(
            runId,
            EnumBuildStatus.Succeeded
          );
          break;
        case 'FAILED':
          await this.buildService.updateStateByRunId(
            runId,
            EnumBuildStatus.Failed
          );
          break;
        case 'STOPPED':
          await this.buildService.updateStateByRunId(
            runId,
            EnumBuildStatus.Stopped
          );
          break;
      }

      await this.buildService.logGenerateStatusByRunId(runId, status);
    } catch (error) {
      this.logger.error(
        `Failed to update build status' buildId: ${buildId}, runId: ${runId}, status: ${status}, error: ${error}`
      );
    }
  }
}
