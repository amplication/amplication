import { EnumResourceType } from "@amplication/code-gen-types";
import { IsNumber, IsString } from "class-validator";

export class Value {
  @IsString()
  techDebtId!: string;

  @IsString()
  externalId!: string;

  @IsString()
  projectId!: string;

  @IsString()
  resourceId!: string;

  @IsString()
  resourceName!: string;

  @IsString()
  workspaceId!: string;

  @IsString()
  envBaseUrl!: string;

  @IsString()
  projectName!: string;

  @IsString()
  resourceType!: EnumResourceType;

  @IsString()
  alertType!: EnumOutdatedVersionAlertType;

  @IsNumber()
  createdAt!: number;
}

export enum EnumOutdatedVersionAlertType {
  TemplateVersion = "TemplateVersion",
  PluginVersion = "PluginVersion",
  CodeEngineVersion = "CodeEngineVersion",
}
