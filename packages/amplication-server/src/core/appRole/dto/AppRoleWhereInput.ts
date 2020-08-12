import { Field, InputType } from '@nestjs/graphql';
import { DateTimeFilter, StringFilter, WhereUniqueInput } from 'src/dto';

@InputType({
  isAbstract: true,
  description: undefined
})
export class AppRoleWhereInput {
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

  @Field(() => StringFilter, {
    nullable: true,
    description: undefined
  })
  displayName?: StringFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
    description: undefined
  })
  description?: StringFilter | null;

  @Field(() => WhereUniqueInput, {
    nullable: true,
    description: undefined
  })
  app?: WhereUniqueInput | null;
}
