import { Field, ObjectType } from "@nestjs/graphql";
import { Commit, Resource } from "../../../models";
import { BlockVersion } from "../../../models/BlockVersion";
import { EntityVersion } from "../../../models/EntityVersion";
import { User } from "../../../models/User";
import { Action } from "../../action/dto/Action";
import { EnumBuildStatus } from "./EnumBuildStatus";
import { EnumBuildGitStatus } from "./EnumBuildGitStatus";

@ObjectType({
  isAbstract: true,
})
export class Build {
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

  @Field(() => EnumBuildStatus, { nullable: false })
  status: keyof typeof EnumBuildStatus;

  @Field(() => EnumBuildGitStatus, { nullable: false })
  gitStatus: keyof typeof EnumBuildGitStatus;

  @Field(() => String, { nullable: true })
  archiveURI?: string;

  blockVersions?: BlockVersion[] | null | undefined;

  entityVersions?: EntityVersion[] | null | undefined;

  @Field(() => String, { nullable: false })
  version: string;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => String, { nullable: false })
  actionId: string;

  @Field(() => Action, { nullable: true })
  action?: Action;

  @Field(() => Commit, { nullable: true })
  commit?: Commit;

  @Field(() => String, { nullable: false })
  commitId!: string;

  @Field(() => String, { nullable: true })
  codeGeneratorVersion?: string;

  @Field(() => Number, { nullable: true })
  linesOfCodeAdded?: number;

  @Field(() => Number, { nullable: true })
  linesOfCodeDeleted?: number;

  @Field(() => Number, { nullable: true })
  filesChanged?: number;
}
