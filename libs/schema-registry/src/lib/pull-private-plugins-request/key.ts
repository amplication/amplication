import { IsString } from "class-validator";

export class Key {
  @IsString()
  resourceId!: string | null;
}
