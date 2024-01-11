import { StatusEnum } from "./StatusEnum";
import { IsNumber, ValidateNested } from "class-validator";

export class ResultMessage<Dto> {
  @ValidateNested()
  value!: Dto | null;
  @IsNumber()
  status!: StatusEnum;
  error: string | null = null;
}
