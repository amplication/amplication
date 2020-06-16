import { Field, InputType } from '@nestjs/graphql';
import { EntityWhereInput } from 'src/core/entity/dto';
import { EnumDataTypeFilter } from './EnumDataTypeFilter';

import { StringFilter, BooleanFilter, DateTimeFilter } from 'src/dto';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityFieldWhereInput {
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

  @Field(() => EnumDataTypeFilter, {
    nullable: true,
    description: undefined
  })
  dataType?: EnumDataTypeFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
    description: undefined
  })
  properties?: StringFilter | null;

  @Field(() => BooleanFilter, {
    nullable: true,
    description: undefined
  })
  required?: BooleanFilter | null;

  @Field(() => BooleanFilter, {
    nullable: true,
    description: undefined
  })
  searchable?: BooleanFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
    description: undefined
  })
  description?: StringFilter | null;

  @Field(() => [EntityFieldWhereInput], {
    nullable: true,
    description: undefined
  })
  AND?: EntityFieldWhereInput[] | null;

  @Field(() => [EntityFieldWhereInput], {
    nullable: true,
    description: undefined
  })
  OR?: EntityFieldWhereInput[] | null;

  @Field(() => [EntityFieldWhereInput], {
    nullable: true,
    description: undefined
  })
  NOT?: EntityFieldWhereInput[] | null;

  @Field(() => EntityWhereInput, {
    nullable: true,
    description: undefined
  })
  entity?: EntityWhereInput | null;
}
