import { Workspace } from './Workspace';
import { Resource } from './Resource';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({
  isAbstract: true
})
export class Project {
  @Field(() => String, {
    nullable: false
  })
  id!: string;

  @Field(() => String, {
    nullable: false
  })
  name!: string;

  workspace?: Workspace;

  workspaceId?: string;

  @Field(() => [Resource], {
    nullable: true
  })
  resources?: Resource[];

  deletedAt?: Date;
}
