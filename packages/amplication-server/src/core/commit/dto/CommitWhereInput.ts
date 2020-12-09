import { Field, InputType } from '@nestjs/graphql';
import { WhereUniqueInput, DateTimeFilter, StringFilter } from 'src/dto';

@InputType({
  isAbstract: true
})
export class CommitWhereInput {
  @Field(() => StringFilter, {
    nullable: true
  })
  id?: StringFilter | null;

  @Field(() => DateTimeFilter, {
    nullable: true
  })
  createdAt?: DateTimeFilter | null;

  @Field(() => WhereUniqueInput)
  app?: WhereUniqueInput;

  @Field(() => WhereUniqueInput, {
    nullable: true
  })
  user?: WhereUniqueInput | null;

  @Field(() => StringFilter, {
    nullable: true
  })
  message?: StringFilter | null;
}
