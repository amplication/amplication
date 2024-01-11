import { User } from "../../../models";
import { EnumWorkspaceMemberType } from "./EnumWorkspaceMemberType";
import { Invitation } from "./Invitation";
import { WorkspaceMemberType } from "./WorkspaceMemberType";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
})
export class WorkspaceMember {
  @Field(() => EnumWorkspaceMemberType, {
    nullable: false,
  })
  type!: EnumWorkspaceMemberType;

  @Field(() => WorkspaceMemberType, {
    nullable: false,
  })
  member!: User | Invitation;
}
