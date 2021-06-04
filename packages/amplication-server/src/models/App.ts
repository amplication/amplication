import { Field, ObjectType } from '@nestjs/graphql';
import { Entity } from './Entity'; // eslint-disable-line import/no-cycle
import { Workspace } from './Workspace'; // eslint-disable-line import/no-cycle
import { Build } from '../core/build/dto/Build'; // eslint-disable-line import/no-cycle
import { Environment } from '../core/environment/dto/Environment'; // eslint-disable-line import/no-cycle

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class App {
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

  //Sensitive data - do not expose to graphQL
  githubToken?: string;

  @Field(() => Date, {
    nullable: true
  })
  githubTokenCreatedDate?: Date;

  @Field(() => Boolean)
  githubSyncEnabled: boolean;

  @Field(() => String, {
    nullable: true
  })
  githubRepo?: string;

  @Field(() => String, {
    nullable: true
  })
  githubBranch?: string;

  @Field(() => Date, {
    nullable: true
  })
  githubLastSync?: Date;

  @Field(() => String, {
    nullable: true
  })
  githubLastMessage?: string;
}
