import { IsString } from "class-validator";

export class Key {
  @IsString()
  resourceRepositoryId!: string;

  @IsString()
  resourceId!: string | null;
}
