import { Field, ObjectType } from "@nestjs/graphql";
import { Workspace } from "./Workspace";

@ObjectType({
  isAbstract: true,
})
export class Role {
  @Field(() => String, {
    nullable: false,
  })
  id!: string;

  @Field(() => Date, { nullable: false })
  createdAt!: Date;

  @Field(() => Date, { nullable: false })
  updatedAt!: Date;

  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => String, {
    nullable: false,
  })
  key!: string;

  @Field(() => String, {
    nullable: true,
  })
  description?: string;

  @Field(() => [String], {
    nullable: true,
  })
  permissions?: string[];

  workspace?: Workspace;

  workspaceId?: string;

  deletedAt?: Date;
}
