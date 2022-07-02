import { Field, InputType } from '@nestjs/graphql';
import { Resource } from 'src/models';

@InputType({ isAbstract: true })
export class ProjectCreateInput {
  @Field(() => String, { nullable: false })
  name!: string;

  @Field(() => String, { nullable: false })
  workspaceId!: string;

  @Field(() => [Resource], { nullable: false })
  resources!: string;
}
