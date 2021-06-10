import { Field, InputType } from '@nestjs/graphql';
import { DateTimeFilter, StringFilter } from 'src/dto';
import { WorkspaceWhereInput } from 'src/core/workspace/dto';

@InputType({
  isAbstract: true,
  description: undefined
})
export class UserWhereInput {
  @Field(() => StringFilter, {
    nullable: true,
    description: undefined
  })
  id?: StringFilter | null;

  @Field(() => DateTimeFilter, {
    nullable: true,
    description: undefined
  })
  createdAt?: DateTimeFilter | null;

  @Field(() => DateTimeFilter, {
    nullable: true,
    description: undefined
  })
  updatedAt?: DateTimeFilter | null;

  @Field(() => WorkspaceWhereInput, {
    nullable: true,
    description: undefined
  })
  workspace?: WorkspaceWhereInput | null;
}
