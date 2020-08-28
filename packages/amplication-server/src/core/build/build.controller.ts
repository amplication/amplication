import { Get, Param, Res, Controller } from '@nestjs/common';
import { Response } from 'express';
import { BuildService } from './build.service';

const ZIP_MIME = 'application/zip';

@Controller('generated-apps')
export class BuildController {
  constructor(private readonly buildService: BuildService) {}
  @Get(`/:id.zip`)
  async generatedApp(@Param('id') id: string, @Res() res: Response) {
    const stream = await this.buildService.download({ where: { id } });
    res.set({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': ZIP_MIME
    });
    stream.pipe(res);
  }
}
