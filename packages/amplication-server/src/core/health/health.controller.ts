import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express'; // eslint-disable-line import/no-unresolved

@Controller('_health')
export class HealthController {
  @Get('live')
  healthLive(@Res() response: Response): Response {
    return response.status(HttpStatus.NO_CONTENT).send();
  }
}
