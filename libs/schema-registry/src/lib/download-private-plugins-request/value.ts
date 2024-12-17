import { IsArray, IsString } from "class-validator";
import { RepositoryPlugins } from "./types";

export class Value {
  @IsString()
  resourceId!: string;
  @IsString()
  buildId!: string;
  @IsArray()
  repositoryPlugins!: RepositoryPlugins[];
}
