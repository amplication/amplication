import { Field, ObjectType } from "@nestjs/graphql";
import { Workspace } from "./Workspace";

@ObjectType({
  isAbstract: true,
})
export class Blueprint {
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

  @Field(() => Boolean, {
    nullable: false,
  })
  enabled!: boolean;

  @Field(() => String, {
    nullable: true,
  })
  description?: string;

  workspace?: Workspace;

  workspaceId?: string;

  deletedAt?: Date;
}