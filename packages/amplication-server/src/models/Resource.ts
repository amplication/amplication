import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Entity } from './Entity'; // eslint-disable-line import/no-cycle
import { Workspace } from './Workspace'; // eslint-disable-line import/no-cycle
import { Build } from '../core/build/dto/Build'; // eslint-disable-line import/no-cycle
import { Environment } from '../core/environment/dto/Environment'; // eslint-disable-line import/no-cycle
import { GitRepository } from './GitRepository';
import { EnumResourceType } from '@amplication/prisma-db';

registerEnumType(EnumResourceType, {
  name: 'EnumResourceType'
});

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class Resource {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  id!: string;

  @Field(() => Date, {
    nullable: false,
    description: undefined
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: false,
    description: undefined
  })
  updatedAt!: Date;

  workspace?: Workspace;

  workspaceId?: string;

  @Field(() => GitRepository, {
    nullable: true
  })
  gitRepository?: GitRepository;

  @Field(() => String, { nullable: true })
  gitRepositoryId?: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  description!: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  color?: string;

  @Field(() => [Entity], {
    nullable: false,
    description: undefined
  })
  entities?: Entity[];

  @Field(() => [Environment], {
    nullable: false
  })
  environments?: Environment[];

  @Field(() => [Build], {
    nullable: false,
    description: undefined
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
  type!: keyof typeof EnumResourceType;

  // no need to expose to GraphQL
  deletedAt?: Date;
}
