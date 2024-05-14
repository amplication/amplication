import { IsString } from "class-validator";

export class Value {
  @IsString()
  externalId!: string;

  @IsString()
  notificationTemplateIdentifier!: string;
}
