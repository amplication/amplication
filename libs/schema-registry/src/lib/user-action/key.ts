import { IsString } from "class-validator";

export class Key {
  @IsString()
  userId!: string;
}
