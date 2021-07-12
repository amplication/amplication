import { Post, Controller, Body, UseInterceptors } from '@nestjs/common';
import { MorganInterceptor } from 'nest-morgan';
import { PaddleService } from './paddle.service';
import { PaddleEvent } from './dto/PaddleEvent';

@Controller('paddle')
export class PaddleController {
  constructor(private readonly paddleService: PaddleService) {}

  @Post('paddle-webhook')
  @UseInterceptors(MorganInterceptor('combined'))
  async paddleWebhook(@Body() body: PaddleEvent): Promise<void> {
    await this.paddleService.handlePaddleWebhook(body);
  }
}
