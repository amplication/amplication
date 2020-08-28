import { Field, InputType } from '@nestjs/graphql';
import {
  BooleanFilter,
  WhereUniqueInput,
  DateTimeFilter,
  StringFilter
} from 'src/dto';
import { EntityFieldFilter } from './EntityFieldFilter';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityWhereInput {
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
  pluralDisplayName?: StringFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
    description: undefined
  })
  description?: StringFilter | null;

  @Field(() => BooleanFilter, {
    nullable: true,
    description: undefined
  })
  isPersistent?: BooleanFilter | null;

  @Field(() => BooleanFilter, {
    nullable: true,
    description: undefined
  })
  allowFeedback?: BooleanFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
    description: undefined
  })
  primaryField?: StringFilter | null;

  @Field(() => EntityFieldFilter, {
    nullable: true,
    description: undefined
  })
  fields?: EntityFieldFilter | null;

  // @Field(() => [EntityWhereInput], {
  //   nullable: true,
  //   description: undefined
  // })
  // AND?: EntityWhereInput[] | null;

  // @Field(() => [EntityWhereInput], {
  //   nullable: true,
  //   description: undefined
  // })
  // OR?: EntityWhereInput[] | null;

  // @Field(() => [EntityWhereInput], {
  //   nullable: true,
  //   description: undefined
  // })
  // NOT?: EntityWhereInput[] | null;

  @Field(() => WhereUniqueInput, {
    nullable: true,
    description: undefined
  })
  app?: WhereUniqueInput | null;
}
