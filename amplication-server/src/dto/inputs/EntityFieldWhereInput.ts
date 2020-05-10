import { Field, InputType } from '@nestjs/graphql';
import { BooleanFilter } from './BooleanFilter';
import { DateTimeFilter } from './DateTimeFilter';
import { EntityWhereInput } from './EntityWhereInput';
import { EnumDataTypeFilter } from './EnumDataTypeFilter';
import { StringFilter } from './StringFilter';

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
  dataTypeProperties?: StringFilter | null;

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
