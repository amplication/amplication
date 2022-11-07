import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../../../models";
import { Invitation } from "./Invitation";
import { EnumWorkspaceMemberType } from "./EnumWorkspaceMemberType";
import { WorkspaceMemberType } from "./WorkspaceMemberType";

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
