import { Field, ObjectType } from "@nestjs/graphql";
import { Commit, Resource } from "../../../models";
import { BlockVersion } from "../../../models/BlockVersion";
import { EntityVersion } from "../../../models/EntityVersion";
import { User } from "../../../models/User";
import { Action } from "../../action/dto/Action";
import { EnumBuildStatus } from "./EnumBuildStatus";

@ObjectType({
  isAbstract: true,
})
export class Build {
  @Field(() => String, {
    nullable: false,
  })
  id!: string;

  @Field(() => Date, {
    nullable: false,
  })
  createdAt!: Date;

  @Field(() => Resource, { nullable: true })
  resource?: Resource;

  @Field(() => String, { nullable: false })
  resourceId!: string;

  @Field(() => User)
  createdBy?: User;

  @Field(() => String, {
    nullable: false,
  })
  userId!: string;

  @Field(() => EnumBuildStatus, {
    nullable: true,
  })
  status?: keyof typeof EnumBuildStatus;

  @Field(() => String)
  archiveURI?: string;

  blockVersions?: BlockVersion[] | null | undefined;

  entityVersions?: EntityVersion[] | null | undefined;

  @Field(() => String, {
    nullable: false,
  })
  version: string;

  @Field(() => String)
  message?: string;

  @Field(() => String)
  actionId: string;

  @Field(() => Action, {
    nullable: true,
  })
  action?: Action;

  @Field(() => Commit)
  commit?: Commit;

  @Field(() => String)
  commitId!: string;

  @Field(() => String, { nullable: true })
  codeGeneratorVersion?: string;
}
