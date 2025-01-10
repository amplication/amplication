import { Field, ObjectType } from "@nestjs/graphql";
import { Account } from "./Account";
import { Workspace } from "./Workspace";

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

  @Field(() => Boolean, {
    nullable: false,
  })
  isOwner: boolean;

  @Field(() => Date, {
    nullable: true,
  })
  lastActive?: Date | null;

  @Field(() => Date, {
    nullable: true,
  })
  lastActive1?: Date | null;
}
