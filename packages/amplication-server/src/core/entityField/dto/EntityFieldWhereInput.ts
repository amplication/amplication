import { Field, InputType } from '@nestjs/graphql';
import { EntityWhereInput } from 'src/core/entity/dto';
import { EnumDataTypeFilter } from './';

import { StringFilter, BooleanFilter, DateTimeFilter } from 'src/dto';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityFieldWhereInput {
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

  @Field(_type => EnumDataTypeFilter, {
    nullable: true,
    description: undefined
  })
  dataType?: EnumDataTypeFilter | null;

  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  properties?: StringFilter | null;

  @Field(_type => BooleanFilter, {
    nullable: true,
    description: undefined
  })
  required?: BooleanFilter | null;

  @Field(_type => BooleanFilter, {
    nullable: true,
    description: undefined
  })
  searchable?: BooleanFilter | null;

  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  description?: StringFilter | null;

  @Field(_type => [EntityFieldWhereInput], {
    nullable: true,
    description: undefined
  })
  AND?: EntityFieldWhereInput[] | null;

  @Field(_type => [EntityFieldWhereInput], {
    nullable: true,
    description: undefined
  })
  OR?: EntityFieldWhereInput[] | null;

  @Field(_type => [EntityFieldWhereInput], {
    nullable: true,
    description: undefined
  })
  NOT?: EntityFieldWhereInput[] | null;

  @Field(_type => EntityWhereInput, {
    nullable: true,
    description: undefined
  })
  entity?: EntityWhereInput | null;
}
