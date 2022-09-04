import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Entity } from './Entity'; // eslint-disable-line import/no-cycle
import { Build } from '../core/build/dto/Build'; // eslint-disable-line import/no-cycle
import { Environment } from '../core/environment/dto/Environment'; // eslint-disable-line import/no-cycle
import { GitRepository } from './GitRepository';
import { EnumResourceType } from '@amplication/prisma-db';
import { Project } from './Project';

registerEnumType(EnumResourceType, {
  name: 'EnumResourceType'
});

@ObjectType({
  isAbstract: true
})
export class Resource {
  @Field(() => String, {
    nullable: false
  })
  id!: string;

  @Field(() => Date, {
    nullable: false
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: false
  })
  updatedAt!: Date;

  @Field(() => Project, { nullable: true })
  project?: Project;

  @Field(() => String, { nullable: true })
  projectId?: string;

  @Field(() => GitRepository, {
    nullable: true
  })
  gitRepository?: GitRepository;

  @Field(() => String, { nullable: true })
  gitRepositoryId?: string;

  @Field(() => String, {
    nullable: false
  })
  name!: string;

  @Field(() => String, {
    nullable: false
  })
  description!: string;

  @Field(() => [Entity], {
    nullable: false
  })
  entities?: Entity[];

  @Field(() => [Environment], {
    nullable: false
  })
  environments?: Environment[];

  @Field(() => [Build], {
    nullable: false
  })
  builds?: Build[];

  @Field(() => String, {
    nullable: true
  })
  githubLastMessage?: string;

  @Field(() => Date, {
    nullable: true
  })
  githubLastSync?: Date;

  @Field(() => EnumResourceType, { nullable: false })
  resourceType!: keyof typeof EnumResourceType;

  @Field(() => Boolean, {
    nullable: false
  })
  gitRepositoryOverride!: boolean;

  // no need to expose to GraphQL
  deletedAt?: Date;
}
