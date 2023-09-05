import { Field, InputType } from "@nestjs/graphql";
import { EnumDataTypeFilter } from "./EnumDataTypeFilter";

import { StringFilter, BooleanFilter, DateTimeFilter } from "../../../dto";

@InputType({
  isAbstract: true,
})
export class EntityFieldWhereInput {
  @Field(() => StringFilter, {
    nullable: true,
  })
  id?: StringFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
  })
  permanentId?: StringFilter | null;

  @Field(() => DateTimeFilter, {
    nullable: true,
  })
  createdAt?: DateTimeFilter | null;

  @Field(() => DateTimeFilter, {
    nullable: true,
  })
  updatedAt?: DateTimeFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
  })
  name?: StringFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
  })
  displayName?: StringFilter | null;

  @Field(() => EnumDataTypeFilter, {
    nullable: true,
  })
  dataType?: EnumDataTypeFilter | null;

  @Field(() => BooleanFilter, {
    nullable: true,
  })
  required?: BooleanFilter | null;

  @Field(() => BooleanFilter, {
    nullable: true,
  })
  unique?: BooleanFilter | null;

  @Field(() => BooleanFilter, {
    nullable: true,
  })
  searchable?: BooleanFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
  })
  customAttributes?: StringFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
  })
  description?: StringFilter | null;
}
