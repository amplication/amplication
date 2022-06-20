import { Injectable } from '@nestjs/common';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import { ConfigService } from '@nestjs/config';
import { SendInvitationArgs } from './dto/SendInvitationArgs';
import { SendDeploymentArgs } from './dto/SendDeploymentArgs';

const SENDGRID_FROM_ADDRESS_VAR = 'SENDGRID_FROM_ADDRESS';
const SENDGRID_INVITATION_TEMPLATE_ID_VAR = 'SENDGRID_INVITATION_TEMPLATE_ID';

const SENDGRID_DEPLOY_SUCCESS_TEMPLATE_ID_VAR =
  'SENDGRID_INVITATION_TEMPLATE_ID';

const SENDGRID_DEPLOY_FAIL_TEMPLATE_ID_VAR = 'SENDGRID_INVITATION_TEMPLATE_ID';

export const HOST_VAR = 'HOST';
// set deployment notification to false until Novu notification implementation
const IS_EMAIL_DEPLOYMENT_NOTIFICATION = 'false';

@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService,
    @InjectSendGrid() private readonly client: SendGridService
  ) {}

  async sendInvitation(args: SendInvitationArgs): Promise<boolean> {
    const from = this.configService.get(SENDGRID_FROM_ADDRESS_VAR);
    const templateId = this.configService.get(
      SENDGRID_INVITATION_TEMPLATE_ID_VAR
    );

    const host = this.configService.get(HOST_VAR);

    const inviteUrl = `${host}/login?invitation=${args.invitationToken}`;

    console.log({ args });

    const msg = {
      to: args.to,
      from,
      templateId,
      dynamicTemplateData: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        inviter_name: args.invitedByUserFullName,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        invitation_url: inviteUrl
      }
    };
    await this.client.send(msg);
    return true;
  }

  async sendDeploymentNotification(args: SendDeploymentArgs): Promise<void> {
    if (IS_EMAIL_DEPLOYMENT_NOTIFICATION) {
      const from = this.configService.get(SENDGRID_FROM_ADDRESS_VAR);

      let templateId;
      if (args.success) {
        templateId = this.configService.get(
          SENDGRID_DEPLOY_SUCCESS_TEMPLATE_ID_VAR
        );
      } else {
        templateId = this.configService.get(
          SENDGRID_DEPLOY_FAIL_TEMPLATE_ID_VAR
        );
      }

      console.log({ args });

      const msg = {
        to: args.to,
        from,
        templateId,
        dynamicTemplateData: {
          url: args.url
        }
      };
      await this.client.send(msg);
    }
  }
}
