import { Workspace } from "./Workspace";
import { Resource } from "./Resource";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
})
export class Project {
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

  @Field(() => [Resource], {
    nullable: true,
  })
  resources?: Resource[];

  @Field(() => Date, { nullable: false })
  createdAt!: Date;

  @Field(() => Date, { nullable: false })
  updatedAt!: Date;

  deletedAt?: Date;

  @Field(() => Boolean, {
    nullable: false,
  })
  useDemoRepo!: boolean;

  @Field(() => String, {
    nullable: true,
  })
  demoRepoName?: string;
}
