import { Post, Controller, Body, UseInterceptors, Res } from '@nestjs/common';
import { MorganInterceptor } from 'nest-morgan';
import { PaddleService } from './paddle.service';
import { PaddleEvent } from './dto/PaddleEvent';
import { Response } from 'express';

@Controller('paddle')
export class PaddleController {
  constructor(private readonly paddleService: PaddleService) {}

  @Post('paddle-webhook')
  @UseInterceptors(MorganInterceptor('combined'))
  async paddleWebhook(
    @Body() body: PaddleEvent,
    @Res() response: Response
  ): Promise<void> {
    await this.paddleService.handlePaddleWebhook(body);
    response.sendStatus(200);
  }
}
