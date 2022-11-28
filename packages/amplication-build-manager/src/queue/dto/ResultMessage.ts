import { IsNumber, ValidateNested } from "class-validator";
import { StatusEnum } from "./StatusEnum";

export class ResultMessage<Dto> {
  @ValidateNested()
  value!: Dto | null;
  @IsNumber()
  status!: StatusEnum;
  error: string | null = null;
}
