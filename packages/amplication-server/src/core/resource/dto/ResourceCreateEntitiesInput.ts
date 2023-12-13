import { EnumResourceType } from "./EnumResourceType";
import { Field, InputType } from "@nestjs/graphql";
import { WhereParentIdInput } from "../../../dto";
import { ServiceSettingsUpdateInput } from "../../serviceSettings/dto/ServiceSettingsUpdateInput";
import { ConnectGitRepositoryInput } from "../../git/dto/inputs/ConnectGitRepositoryInput";
import { Entity } from "packages/amplication-server/src/models";

@InputType({
  isAbstract: true,
})
export class ResourceCreateEntitiesInput {
  @Field(() => String, {
    nullable: false,
  })
  originalResourceId!: string;

  @Field(() => String, {
    nullable: false,
  })
  targetResourceId!: string;

  @Field(() => [Entity], {
    nullable: false,
  })
  entities!: Entity[];
}
