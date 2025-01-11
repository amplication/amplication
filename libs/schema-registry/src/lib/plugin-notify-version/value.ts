import { IsString } from "class-validator";

export class Value {
  @IsString()
  buildId!: string;

  @IsString()
  requestedFullPackageName!: string; // @amplication/db-postgres@latest

  @IsString()
  packageName!: string; // @amplication/db-postgres

  @IsString()
  packageVersion!: string; // 1.0.1
}
