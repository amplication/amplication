import { Field, InputType } from '@nestjs/graphql';
import { DateTimeFilter, StringFilter, WhereUniqueInput } from 'src/dto';

@InputType({
  isAbstract: true
})
export class ResourceRoleWhereInput {
  @Field(() => String, {
    nullable: true
  })
  id?: string | null;

  @Field(() => DateTimeFilter, {
    nullable: true
  })
  createdAt?: DateTimeFilter | null;

  @Field(() => DateTimeFilter, {
    nullable: true
  })
  updatedAt?: DateTimeFilter | null;

  @Field(() => StringFilter, {
    nullable: true
  })
  name?: StringFilter | null;

  @Field(() => StringFilter, {
    nullable: true
  })
  displayName?: StringFilter | null;

  @Field(() => StringFilter, {
    nullable: true
  })
  description?: StringFilter | null;

  @Field(() => WhereUniqueInput, {
    nullable: true
  })
  resource?: WhereUniqueInput | null;
}
