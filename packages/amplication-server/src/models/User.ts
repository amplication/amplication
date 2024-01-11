import { Account } from "./Account";
import { UserRole } from "./UserRole";
import { Workspace } from "./Workspace";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
})
export class User {
  @Field(() => String, {
    nullable: false,
  })
  id!: string;

  @Field(() => Date, {
    nullable: false,
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: false,
  })
  updatedAt!: Date;

  @Field(() => Account, {
    nullable: true,
  })
  account?: Account;

  @Field(() => Workspace, {
    nullable: true,
  })
  workspace?: Workspace;

  @Field(() => [UserRole], {
    nullable: true,
  })
  userRoles?: UserRole[] | null;

  @Field(() => Boolean, {
    nullable: false,
  })
  isOwner: boolean;

  @Field(() => Date, {
    nullable: true,
  })
  lastActive?: Date | null;
}
