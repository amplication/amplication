import { Workspace } from './Workspace';
import { Resource } from './Resource';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class Project {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  id!: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  @Field(() => Workspace, {
    nullable: false,
    description: undefined
  })
  workspace!: Workspace;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  workspaceId!: string;

  @Field(() => [Resource], {
    nullable: false,
    description: undefined
  })
  resources!: Resource[];

  @Field(() => Date, {
    nullable: false,
    description: undefined
  })
  deletedAt?: Date;
}
