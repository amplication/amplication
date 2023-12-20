import { EnumResourceType } from "./EnumResourceType";
import { Field, InputType } from "@nestjs/graphql";
import { WhereParentIdInput } from "../../../dto";
import { ServiceSettingsUpdateInput } from "../../serviceSettings/dto/ServiceSettingsUpdateInput";
import { ConnectGitRepositoryInput } from "../../git/dto/inputs/ConnectGitRepositoryInput";
import { Entity } from "packages/amplication-server/src/models";

@InputType({
  isAbstract: true,
})
export class CopiedEntities extends Entity {
  @Field(() => Boolean, {
    nullable: false,
  })
  shouldDeleteFromSource!: boolean;
}
