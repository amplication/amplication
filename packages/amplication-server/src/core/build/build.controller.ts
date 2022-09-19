import {
  Get,
  Param,
  Res,
  Controller,
  UseInterceptors,
  NotFoundException,
  BadRequestException, Inject
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
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CHECK_USER_ACCESS_TOPIC } from '../../constants';
import { KafkaMessage } from 'kafkajs';
import { ResultMessage } from '../queue/dto/ResultMessage';
import { StatusEnum } from '../queue/dto/StatusEnum';
import {CommitStateDto, EnvironmentVariables} from '@amplication/kafka';
import {Logger} from "winston";
import {WINSTON_MODULE_PROVIDER} from "nest-winston";

const ZIP_MIME = 'application/zip';
@Controller('generated-apps')
export class BuildController {

  public static COMMIT_STATE_TOPIC = "git.internal.commit-state.request.0"

  constructor(private readonly buildService: BuildService,
              @Inject(WINSTON_MODULE_PROVIDER)  private logger: Logger) {}

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
      BuildController.COMMIT_STATE_TOPIC
  )
  async updateCommitState(@Payload() message: KafkaMessage): Promise<void> {
    try {
      this.logger.info("BuildController.updateCommitState - received message from kafka", {
        message
      })
      const commitStateDto = plainToInstance(CommitStateDto, message.value);
      await this.buildService.updateCommitState(commitStateDto)

    } catch (error) {
      this.logger.error("BuildController.updateCommitState - Failed handle message from kafka", {
        message
      }, error)
    }
  }
}
