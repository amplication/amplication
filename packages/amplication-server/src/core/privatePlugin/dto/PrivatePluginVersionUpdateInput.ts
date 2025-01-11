import { Field, InputType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import type { JsonValue } from "type-fest";

@InputType({
  isAbstract: true,
})
export class PrivatePluginVersionUpdateInput {
  @Field(() => GraphQLJSONObject, {
    nullable: true,
  })
  settings?: JsonValue;

  @Field(() => GraphQLJSONObject, {
    nullable: true,
  })
  configurations?: JsonValue;

  @Field(() => Boolean, {
    nullable: true,
  })
  deprecated?: boolean;

  @Field(() => Boolean, {
    nullable: true,
  })
  enabled?: boolean;
}
