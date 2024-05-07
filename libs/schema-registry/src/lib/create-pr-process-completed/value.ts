import { IsString } from "class-validator";

export class Value {
  @IsString()
  resetPasswordUrl!: string;
  @IsString()
  pullRequestUrl!: string;
  @IsString()
  externalId!: string;
}
