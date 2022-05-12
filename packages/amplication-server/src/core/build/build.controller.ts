import {
  Get,
  Param,
  Res,
  Controller,
  UseInterceptors,
  NotFoundException,
  BadRequestException,
  Query
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
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload
} from '@nestjs/microservices';
import { EnvironmentVariables } from '@amplication/kafka';
import { CHECK_USER_ACCESS_TOPIC } from 'src/constants';
import { KafkaMessage } from 'kafkajs';
import { ResultMessage } from '../queue/dto/ResultMessage';
import { StatusEnum } from '../queue/dto/StatusEnum';

const ZIP_MIME = 'application/zip';

@Controller('generated-apps')
export class BuildController {
  constructor(private readonly buildService: BuildService) {}

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

  // @Get('canUserAccess')
  // async canUserAccess(@Query() args: CanUserAccessArgs): Promise<boolean> {
  //   const validArgs = plainToInstance(CanUserAccessArgs, args);
  //   return this.buildService.canUserAccess(validArgs);
  // }

  // @MessagePattern(
  //   EnvironmentVariables.instance.get(CHECK_USER_ACCESS_TOPIC, true)
  // )
  // checkUserAccess(
  //   @Payload() message: KafkaMessage
  //   // @Ctx() context: KafkaContext
  // ): { value: ResultMessage<boolean> } {
  //   // const validArgs = plainToInstance(CanUserAccessArgs, args);
  //   // return this.buildService.canUserAccess(validArgs);
  //   // this.logger.info(`Got a new generate pull request item from queue.`, {
  //   //   topic: context.getTopic(),
  //   //   partition: context.getPartition(),
  //   //   offset: message.offset,
  //   //   class: this.constructor.name
  //   // });
  //   console.log(message);
  //   return { value: { error: null, status: StatusEnum.Success, value: true } };
  //   // try {
  //   //   const validArgs = plainToClass(SendPullRequestArgs, message.value);
  //   //   const pullRequest = await this.pullRequestService.createPullRequest(
  //   //     validArgs
  //   //   );
  //   //   this.logger.info(`Finish process, committing`, {
  //   //     topic: context.getTopic(),
  //   //     partition: context.getPartition(),
  //   //     offset: message.offset,
  //   //     class: this.constructor.name,
  //   //     buildId: validArgs.newBuildId
  //   //   });
  //   //   return { value: pullRequest };
  //   // } catch (error) {
  //   //   return { value: { value: null, status: StatusEnum.GeneralFail, error } };
  //   // }
  // }
}
