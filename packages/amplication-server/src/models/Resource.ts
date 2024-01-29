import { Field, ObjectType } from "@nestjs/graphql";
import { Entity } from "./Entity";
import { Build } from "../core/build/dto/Build";
import { Environment } from "../core/environment/dto/Environment";
import { GitRepository } from "./GitRepository";
import { EnumResourceType } from "../core/resource/dto/EnumResourceType";
import { Project } from "./Project";
import { CodeGeneratorVersionStrategy } from "../core/resource/dto";

@ObjectType({
  isAbstract: true,
})
export class Resource {
  @Field(() => String, {
    nullable: false,
  })
  id!: string;

  @Field(() => String, {
    nullable: true,
  })
  tempId?: string;

  @Field(() => Date, {
    nullable: false,
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: false,
  })
  updatedAt!: Date;

  @Field(() => Project, { nullable: true })
  project?: Project;

  @Field(() => String, { nullable: true })
  projectId?: string;

  @Field(() => GitRepository, {
    nullable: true,
  })
  gitRepository?: GitRepository;

  @Field(() => String, { nullable: true })
  gitRepositoryId?: string;

  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => String, {
    nullable: false,
  })
  description!: string;

  @Field(() => [Entity], {
    nullable: false,
  })
  entities?: Entity[];

  @Field(() => [Environment], {
    nullable: false,
  })
  environments?: Environment[];

  @Field(() => [Build], {
    nullable: false,
  })
  builds?: Build[];

  @Field(() => String, {
    nullable: true,
  })
  githubLastMessage?: string;

  @Field(() => Date, {
    nullable: true,
  })
  githubLastSync?: Date;

  @Field(() => EnumResourceType, { nullable: false })
  resourceType!: keyof typeof EnumResourceType;

  @Field(() => Boolean, {
    nullable: false,
  })
  gitRepositoryOverride!: boolean;

  @Field(() => String, {
    nullable: true,
  })
  codeGeneratorVersion?: string;

  @Field(() => CodeGeneratorVersionStrategy, {
    nullable: true,
  })
  codeGeneratorStrategy?: keyof typeof CodeGeneratorVersionStrategy;

  @Field(() => Boolean, { nullable: false, defaultValue: true })
  licensed: boolean;

  // no need to expose to GraphQL
  deletedAt?: Date;
}
