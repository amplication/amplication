import { Field, InputType } from '@nestjs/graphql';
import {
  DateTimeFilter,
  StringFilter,
  IntFilter,
  WhereUniqueInput
} from 'src/dto';

@InputType({
  isAbstract: true
})
export class EntityVersionWhereInput {
  @Field(() => StringFilter, {
    nullable: true
  })
  id?: StringFilter | null;

  @Field(() => DateTimeFilter, {
    nullable: true
  })
  createdAt?: DateTimeFilter | null;

  @Field(() => DateTimeFilter, {
    nullable: true
  })
  updatedAt?: DateTimeFilter | null;

  @Field(() => IntFilter, {
    nullable: true
  })
  versionNumber?: IntFilter | null;

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
  pluralDisplayName?: StringFilter | null;

  @Field(() => StringFilter, {
    nullable: true
  })
  description?: StringFilter | null;

  @Field(() => StringFilter, {
    nullable: true
  })
  label?: StringFilter | null;

  @Field(() => WhereUniqueInput, {
    nullable: true
  })
  entity: WhereUniqueInput;
}
