import { Inject, Injectable } from "@nestjs/common";
import { InjectSendGrid, SendGridService } from "@ntegral/nestjs-sendgrid";
import { ConfigService } from "@nestjs/config";
import { SendInvitationArgs } from "./dto/SendInvitationArgs";
import { SendDeploymentArgs } from "./dto/SendDeploymentArgs";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";

const SENDGRID_FROM_ADDRESS_VAR = "SENDGRID_FROM_ADDRESS";
const SENDGRID_INVITATION_TEMPLATE_ID_VAR = "SENDGRID_INVITATION_TEMPLATE_ID";

const SENDGRID_DEPLOY_SUCCESS_TEMPLATE_ID_VAR =
  "SENDGRID_INVITATION_TEMPLATE_ID";

const SENDGRID_DEPLOY_FAIL_TEMPLATE_ID_VAR = "SENDGRID_INVITATION_TEMPLATE_ID";

export const HOST_VAR = "CLIENT_HOST";
// set deployment notification to false until Novu notification implementation
const IS_EMAIL_DEPLOYMENT_NOTIFICATION = false;

@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService,
    @InjectSendGrid() private readonly client: SendGridService,
    @Inject(AmplicationLogger) private readonly logger: AmplicationLogger
  ) {}

  async sendInvitation(args: SendInvitationArgs): Promise<boolean> {
    const fromAddress = this.configService.get(SENDGRID_FROM_ADDRESS_VAR);
    const invitationTemplateId = this.configService.get(
      SENDGRID_INVITATION_TEMPLATE_ID_VAR
    );

    const host = this.configService.get(HOST_VAR);

    const inviteUrl = `${host}/login?invitation=${args.invitationToken}`;

    const dynamicTemplateData = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      inviter_name: args.invitedByUserFullName,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      invitation_url: inviteUrl,
    };

    this.logger.debug("sendInvitation", args);

    const msg = {
      to: args.to,
      from: fromAddress,
      templateId: invitationTemplateId,
      dynamicTemplateData,
    };
    await this.client.send(msg);
    return true;
  }

  async sendDeploymentNotification(args: SendDeploymentArgs): Promise<void> {
    const shouldSendNotification = this.shouldSendDeploymentNotification();

    if (shouldSendNotification) {
      const fromAddress = this.configService.get(SENDGRID_FROM_ADDRESS_VAR);

      const templateId = args.success
        ? this.configService.get(SENDGRID_DEPLOY_SUCCESS_TEMPLATE_ID_VAR)
        : this.configService.get(SENDGRID_DEPLOY_FAIL_TEMPLATE_ID_VAR);

      this.logger.debug("sendDeploymentNotification", args);

      const message = {
        to: args.to,
        from: fromAddress,
        templateId,
        dynamicTemplateData: {
          url: args.url,
        },
      };

      await this.client.send(message);
    }
  }

  private shouldSendDeploymentNotification(): boolean {
    return IS_EMAIL_DEPLOYMENT_NOTIFICATION;
  }
}
