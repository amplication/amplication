import { IsNumber, IsString } from "class-validator";

export class Value {
  @IsString()
  buildId!: string;

  @IsString()
  externalId!: string;

  @IsString()
  commitId!: string;

  @IsString()
  commitMessage!: string;

  @IsString()
  projectId!: string;

  @IsString()
  resourceId!: string;

  @IsString()
  resourceName!: string;

  @IsString()
  workspaceId!: string;

  @IsString()
  projectName!: string;

  @IsNumber()
  createdAt!: number;
}
