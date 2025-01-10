import { Field, ObjectType } from "@nestjs/graphql";
import { Entity } from "./Entity";
import { Build } from "../core/build/dto/Build";
import { Environment } from "../core/environment/dto/Environment";
import { GitRepository } from "./GitRepository";
import { EnumResourceType } from "../core/resource/dto/EnumResourceType";
import { Project } from "./Project";
import { CodeGeneratorVersionStrategy } from "../core/resource/dto";
import type { JsonValue } from "type-fest";
import { GraphQLJSONObject } from "graphql-type-json";
import { Blueprint } from "./Blueprint";

@ObjectType({
  isAbstract: true,
})
export class Resource {
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

  // instead of exposing the value of this field, we expose an enum using resolveField on the resourceResolver
  codeGeneratorName?: string;

  @Field(() => Boolean, { nullable: false, defaultValue: true })
  licensed: boolean;

  // no need to expose to GraphQL
  deletedAt?: Date;

  // we do not expose this field to the client. instead, we use resolveField on the resourceResolver for Owner
  ownershipId?: string;

  @Field(() => GraphQLJSONObject, {
    nullable: true,
  })
  properties?: JsonValue;

  @Field(() => Blueprint, { nullable: true })
  blueprint?: Blueprint;

  @Field(() => String, { nullable: true })
  blueprintId?: string;

  @Field(() => String, { nullable: true })
  newProp?: string;
}
