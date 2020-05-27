import { Field, InputType } from '@nestjs/graphql';
import {
  BooleanFilter,
  EntityFieldFilter,
  WhereUniqueInput,
  DateTimeFilter,
  StringFilter
} from '../../../dto/inputs';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityWhereInput {
  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  id?: StringFilter | null;

  @Field(_type => DateTimeFilter, {
    nullable: true,
    description: undefined
  })
  createdAt?: DateTimeFilter | null;

  @Field(_type => DateTimeFilter, {
    nullable: true,
    description: undefined
  })
  updatedAt?: DateTimeFilter | null;

  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  name?: StringFilter | null;

  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  displayName?: StringFilter | null;

  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  pluralDisplayName?: StringFilter | null;

  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  description?: StringFilter | null;

  @Field(_type => BooleanFilter, {
    nullable: true,
    description: undefined
  })
  isPersistent?: BooleanFilter | null;

  @Field(_type => BooleanFilter, {
    nullable: true,
    description: undefined
  })
  allowFeedback?: BooleanFilter | null;

  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  primaryField?: StringFilter | null;

  @Field(_type => EntityFieldFilter, {
    nullable: true,
    description: undefined
  })
  fields?: EntityFieldFilter | null;

  @Field(_type => [EntityWhereInput], {
    nullable: true,
    description: undefined
  })
  AND?: EntityWhereInput[] | null;

  @Field(_type => [EntityWhereInput], {
    nullable: true,
    description: undefined
  })
  OR?: EntityWhereInput[] | null;

  @Field(_type => [EntityWhereInput], {
    nullable: true,
    description: undefined
  })
  NOT?: EntityWhereInput[] | null;

  @Field(_type => WhereUniqueInput, {
    nullable: true,
    description: undefined
  })
  app?: WhereUniqueInput | null;
}
