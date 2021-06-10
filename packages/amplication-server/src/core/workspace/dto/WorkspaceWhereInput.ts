import { Field, InputType } from '@nestjs/graphql';
import { DateTimeFilter, StringFilter } from 'src/dto';

@InputType({
  isAbstract: true,
  description: undefined
})
export class WorkspaceWhereInput {
  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  id?: string | null;

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

  @Field(() => StringFilter, {
    nullable: true,
    description: undefined
  })
  name?: StringFilter | null;
}
