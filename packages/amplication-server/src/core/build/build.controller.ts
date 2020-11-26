import {
  Get,
  Param,
  Res,
  Controller,
  UseInterceptors,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { Response } from 'express';
import { MorganInterceptor } from 'nest-morgan';
import { BuildService } from './build.service';
import { BuildResultNotFound } from './errors/BuildResultNotFound';
import { BuildNotFoundError } from './errors/BuildNotFoundError';
import { StepNotCompleteError } from './errors/StepNotCompleteError';
import { StepNotFoundError } from './errors/StepNotFoundError';

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
}
