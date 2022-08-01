import { InputType, Field } from '@nestjs/graphql';
import { WhereUniqueInput, DateTimeFilter, StringFilter } from 'src/dto';

@InputType({
  isAbstract: true
})
export class BuildWhereInput {
  @Field(() => StringFilter, {
    nullable: true
  })
  id?: StringFilter | null | undefined;

  @Field(() => DateTimeFilter, {
    nullable: true
  })
  createdAt?: DateTimeFilter | null | undefined;

  @Field(() => WhereUniqueInput)
  resource?: WhereUniqueInput;

  @Field(() => WhereUniqueInput, {
    nullable: true
  })
  createdBy?: WhereUniqueInput | null | undefined;

  @Field(() => StringFilter, {
    nullable: true
  })
  version?: StringFilter | null;

  @Field(() => StringFilter, {
    nullable: true
  })
  message?: StringFilter | null;

  @Field(() => WhereUniqueInput, {
    nullable: true
  })
  commit?: WhereUniqueInput;
}
