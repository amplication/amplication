import { ReplyStatusEnum } from "./ReplyStatusEnum";
import { IsNumber, ValidateNested } from "class-validator";

export class ReplyResultMessage<Dto> {
  @ValidateNested()
  value!: Dto | null;
  @IsNumber()
  status!: ReplyStatusEnum;
  error: string | null = null;
}
