import { IsArray, IsString } from "class-validator";

class MessageParam {
  @IsString()
  name!: string;

  @IsString()
  value!: string;
}

export class Value {
  @IsString()
  actionId!: string;

  @IsString()
  requestUniqueId!: string;

  @IsString()
  messageTypeKey!: string;

  @IsArray()
  params!: MessageParam[];
}
