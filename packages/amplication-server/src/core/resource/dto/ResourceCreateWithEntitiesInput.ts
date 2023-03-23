import { Field, InputType, Int } from "@nestjs/graphql";
import { ResourceCreateInput } from "./ResourceCreateInput";
import { EnumDataType } from "../../../enums/EnumDataType";
import { ConnectGitRepositoryInput } from "../../git/dto/inputs/ConnectGitRepositoryInput";
import { ServiceSettingsUpdateInput } from "../../serviceSettings/dto/ServiceSettingsUpdateInput";
import { PluginInstallationsCreateInput } from "../../pluginInstallation/dto/PluginInstallationsCreateInput";

@InputType({
  isAbstract: true,
})
export class ResourceCreateWithEntitiesFieldInput {
  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => EnumDataType, {
    nullable: true,
  })
  dataType?: keyof typeof EnumDataType | null;
}

@InputType({
  isAbstract: true,
})
export class ResourceCreateWithEntitiesEntityInput {
  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => [ResourceCreateWithEntitiesFieldInput], {
    nullable: false,
  })
  fields!: ResourceCreateWithEntitiesFieldInput[];

  @Field(() => [Int], {
    nullable: true,
  })
  relationsToEntityIndex?: number[] | null;
}

@InputType({
  isAbstract: true,
})
export class ResourceCreateWithEntitiesInput {
  @Field(() => ResourceCreateInput, {
    nullable: false,
  })
  resource!: ResourceCreateInput;

  @Field(() => [ResourceCreateWithEntitiesEntityInput], {
    nullable: false,
  })
  entities!: ResourceCreateWithEntitiesEntityInput[];

  @Field(() => ServiceSettingsUpdateInput, {
    nullable: false,
  })
  serviceSettings!: ServiceSettingsUpdateInput;

  @Field(() => ConnectGitRepositoryInput, {
    nullable: false,
  })
  gitRepository!: ConnectGitRepositoryInput;

  @Field(() => String, {
    nullable: false,
  })
  commitMessage!: string;

  @Field(() => PluginInstallationsCreateInput, {
    nullable: true,
  })
  plugins?: PluginInstallationsCreateInput;

  @Field(() => String, {
    nullable: false,
  })
  wizardType!: "create resource" | "onboarding";

  @Field(() => String, {
    nullable: false,
  })
  authType!: string;

  @Field(() => String, {
    nullable: false,
  })
  dbType!: string;

  @Field(() => String, {
    nullable: false,
  })
  repoType!: string;

  // @Field(() => String, {
  //   nullable: false,
  // })
  // gitOrganizationName!: string;
}
