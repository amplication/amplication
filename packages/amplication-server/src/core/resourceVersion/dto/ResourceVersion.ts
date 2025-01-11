import { Field, ObjectType } from "@nestjs/graphql";
import { Commit, Resource } from "../../../models";
import { BlockVersion } from "../../../models/BlockVersion";
import { EntityVersion } from "../../../models/EntityVersion";
import { User } from "../../../models/User";

@ObjectType({
  isAbstract: true,
})
export class ResourceVersion {
  @Field(() => String, { nullable: false })
  id!: string;

  @Field(() => Date, { nullable: false })
  createdAt!: Date;

  @Field(() => Resource, { nullable: true })
  resource?: Resource;

  @Field(() => String, { nullable: false })
  resourceId!: string;

  @Field(() => User, { nullable: true })
  createdBy?: User;

  @Field(() => String, { nullable: false })
  userId!: string;

  blockVersions?: BlockVersion[] | null | undefined;

  entityVersions?: EntityVersion[] | null | undefined;

  @Field(() => String, { nullable: false })
  version: string;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => Commit, { nullable: true })
  commit?: Commit;

  @Field(() => String, { nullable: false })
  commitId!: string;
}
