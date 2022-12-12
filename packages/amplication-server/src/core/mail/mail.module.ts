import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MailService } from "./mail.service";
import { SendGridModule } from "@ntegral/nestjs-sendgrid";

@Module({
  imports: [SendGridModule, ConfigModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
