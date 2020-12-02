import { IsString } from "class-validator";

export class Credentials {
  @IsString()
  username!: string;
  @IsString()
  password!: string;
}
