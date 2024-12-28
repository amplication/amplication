import { Workspace } from "./Workspace";
import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "./User";
import { Role } from "./Role";

@ObjectType({
  isAbstract: true,
})
export class Team {
  @Field(() => String, {
    nullable: false,
  })
  id!: string;

  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  workspace?: Workspace;

  workspaceId?: string;

  @Field(() => Date, { nullable: false })
  createdAt!: Date;

  @Field(() => Date, { nullable: false })
  updatedAt!: Date;

  deletedAt?: Date;

  @Field(() => String, {
    nullable: true,
  })
  description?: string;

  @Field(() => [User], {
    nullable: true,
  })
  members?: User[];

  @Field(() => String, {
    nullable: true,
  })
  color?: string;

  @Field(() => [Role], {
    nullable: true,
  })
  roles?: Role[];
}
