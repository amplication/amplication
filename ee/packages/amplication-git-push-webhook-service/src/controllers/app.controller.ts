import {
  Controller,
  Post,
  Headers,
  Body,
  LoggerService,
  Inject,
} from '@nestjs/common';
import { AppService } from '../services/app.service';
import { EnumProvider } from '../entities/enums/provider';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}
  @Post('/github')
  async createWebhooksMessage(
    @Headers() headers: Headers,
    @Body() payload: string,
  ) {
    this.logger.log('start createWebhooksMessage', {
      class: AppController.name,
      payload,
    });
    await this.appService.createMessage(
      headers['x-github-delivery'],
      headers['x-github-event'],
      payload,
      headers['x-hub-signature-256'],
      EnumProvider.Github,
    );
    this.logger.log('successfully ended createWebhooksMessage', {
      class: AppController.name,
    });
  }
}
