import { EnumResourceType } from "./EnumResourceType";
import { Field, InputType } from "@nestjs/graphql";
import { WhereParentIdInput } from "../../../dto";
import { ServiceSettingsUpdateInput } from "../../serviceSettings/dto/ServiceSettingsUpdateInput";
import { ConnectGitRepositoryInput } from "../../git/dto/inputs/ConnectGitRepositoryInput";

@InputType({
  isAbstract: true,
})
export class ResourceCreateInput {
  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => String, {
    nullable: true,
  })
  tempId?: string;

  @Field(() => String, {
    nullable: false,
  })
  description!: string;

  @Field(() => EnumResourceType, { nullable: false })
  resourceType!: keyof typeof EnumResourceType;

  @Field(() => WhereParentIdInput, { nullable: false })
  project!: WhereParentIdInput;

  @Field(() => ServiceSettingsUpdateInput, { nullable: true })
  serviceSettings?: ServiceSettingsUpdateInput;

  @Field(() => ConnectGitRepositoryInput, { nullable: true })
  gitRepository?: ConnectGitRepositoryInput;
}
