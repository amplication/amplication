import { InputType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@InputType()
export class Credentials {
  @IsString()
  username!: string;
  @IsString()
  password!: string;
}
