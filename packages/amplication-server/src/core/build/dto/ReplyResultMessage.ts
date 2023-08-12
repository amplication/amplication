import { IsNumber, ValidateNested } from "class-validator";
import { ReplyStatusEnum } from "./ReplyStatusEnum";

export class ReplyResultMessage<Dto> {
  @ValidateNested()
  value!: Dto | null;
  @IsNumber()
  status!: ReplyStatusEnum;
  error: string | null = null;
}
