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
import { KafkaMessage } from 'kafkajs';
import {
  BUILD_STATUS_TOPIC,
  CHECK_USER_ACCESS_TOPIC,
  GET_BUILD_BY_RUN_ID_TOPIC
} from '../../constants';
import { ResultMessage } from '../queue/dto/ResultMessage';
import { StatusEnum } from '../queue/dto/StatusEnum';
import { EnvironmentVariables } from '@amplication/kafka';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { BuildStatus } from '@amplication/build-types';
import { Build } from './dto/Build';

const ZIP_MIME = 'application/zip';
@Controller('generated-apps')
export class BuildController {
  constructor(
    private readonly buildService: BuildService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService
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

  @MessagePattern(
    EnvironmentVariables.instance.get(GET_BUILD_BY_RUN_ID_TOPIC, true)
  )
  async getBuildByRunId(@Payload() message): Promise<Build> {
    const runId = message.value;
    try {
      const build = await this.buildService.findByRunId(runId);
      return build;
    } catch (error) {
      this.logger.error(
        `Failed to get build by runId. runId: ${runId}, error: ${error}`
      );
    }
  }

  @EventPattern(EnvironmentVariables.instance.get(BUILD_STATUS_TOPIC, true))
  async onBuildStatus(@Payload() message): Promise<void> {
    const { buildId, runId, status } = message.value;
    try {
      switch (status) {
        case BuildStatus.Init:
          await this.buildService.updateRunId(buildId, runId);
          await this.buildService.logGenerateStatusByRunId(runId, status);
          await this.buildService.updateStateByRunId(runId, status, null);
          break;
        case BuildStatus.InProgress:
        case BuildStatus.Failed:
        case BuildStatus.Stopped:
          await this.buildService.logGenerateStatusByRunId(runId, status);
          await this.buildService.updateStateByRunId(runId, status, null);
          break;
        case BuildStatus.Succeeded:
          await this.buildService.logGenerateStatusByRunId(runId, status);
          await this.buildService.updateStateByRunId(runId, status, new Date());
          await this.buildService.createPR(runId);
          break;
      }
    } catch (error) {
      this.logger.error(
        `Failed to update build status' buildId: ${buildId}, runId: ${runId}, status: ${status}, error: ${error}`
      );
    }
  }
}
