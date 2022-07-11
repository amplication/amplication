import { Field, InputType } from '@nestjs/graphql';
import { WorkspaceWhereInput } from 'src/core/workspace/dto';
import { DateTimeFilter, StringFilter } from 'src/dto';

@InputType({
  isAbstract: true
})
export class ProjectWhereInput {
  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  id?: string | null;

  @Field(() => DateTimeFilter, {
    nullable: true,
    description: undefined
  })
  deletedAt?: DateTimeFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
    description: undefined
  })
  name?: StringFilter | null;

  workspace?: WorkspaceWhereInput | null;
}
