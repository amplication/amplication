// @ts-ignore
// eslint-disable-next-line
import { JsonValue } from "type-fest";
import { InputType, Field } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class JsonNullableFilter {
  @Field(() => GraphQLJSONObject, {
    nullable: true,
  })
  equals?: JsonValue | null;

  @Field(() => GraphQLJSONObject, {
    nullable: true,
  })
  not?: JsonValue | null;
}
