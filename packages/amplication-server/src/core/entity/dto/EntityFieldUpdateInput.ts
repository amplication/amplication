import { Field, InputType, Int } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import type { JsonObject } from "type-fest";
import { EnumDataType } from "../../../enums/EnumDataType";

@InputType({
  isAbstract: true,
})
export class EntityFieldUpdateInput {
  @Field(() => String, {
    nullable: true,
  })
  name?: string | null;

  @Field(() => String, {
    nullable: true,
  })
  displayName?: string | null;

  @Field(() => EnumDataType, {
    nullable: true,
  })
  dataType?: keyof typeof EnumDataType | null;

  @Field(() => GraphQLJSONObject, {
    nullable: true,
  })
  properties?: JsonObject | null;

  @Field(() => Boolean, {
    nullable: true,
  })
  required?: boolean | null;

  @Field(() => Boolean, {
    nullable: true,
  })
  unique?: boolean | null;

  @Field(() => Boolean, {
    nullable: true,
  })
  searchable?: boolean | null;

  @Field(() => String, {
    nullable: true,
  })
  description?: string | null;

  @Field(() => String, {
    nullable: true,
  })
  customAttributes?: string | null;

  @Field(() => Int, {
    nullable: true,
  })
  position?: number | null;
}
