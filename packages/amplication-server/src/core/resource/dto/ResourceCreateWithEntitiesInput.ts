import { Field, InputType, Int } from "@nestjs/graphql";
import { ResourceCreateInput } from "./ResourceCreateInput";
import { EnumDataType } from "../../../enums/EnumDataType";
import { ResourceGenSettingsCreateInput } from "./ResourceGenSettingsCreateInput";
import { ConnectGitRepositoryInput } from "../../git/dto/inputs/ConnectGitRepositoryInput";

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

  @Field(() => ResourceGenSettingsCreateInput, {
    nullable: false,
  })
  generationSettings!: ResourceGenSettingsCreateInput;

  @Field(() => ConnectGitRepositoryInput, {
    nullable: false,
  })
  gitRepository!: ConnectGitRepositoryInput;

  @Field(() => String, {
    nullable: true,
  })
  baseDir?: string;

  @Field(() => String, {
    nullable: false,
  })
  commitMessage!: string;
}
