import {
  Controller,
  Post,
  Headers,
  Body,
  LoggerService,
  Inject,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { EnumProvider } from '../git-organization/git-organization.types';
@Controller()
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}
  @Post('/github')
  async createWebhooksMessage(
    @Headers() headers: Headers,
    @Body() payload: string,
  ) {
    this.logger.log('start createWebhooksMessage', {
      class: WebhookController.name,
      payload,
    });
    await this.webhookService.createMessage(
      headers['x-github-delivery'],
      headers['x-github-event'],
      payload,
      headers['x-hub-signature-256'],
      EnumProvider.Github,
    );
    this.logger.log('successfully ended createWebhooksMessage', {
      class: WebhookController.name,
    });
  }
}
