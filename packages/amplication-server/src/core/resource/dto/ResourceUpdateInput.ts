import { Field, InputType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import type { JsonValue } from "type-fest";

@InputType({
  isAbstract: true,
})
export class ResourceUpdateInput {
  @Field(() => String, {
    nullable: true,
  })
  name?: string | null;

  @Field(() => String, {
    nullable: true,
  })
  description?: string | null;

  @Field(() => GraphQLJSONObject, {
    nullable: true,
  })
  properties?: JsonValue | null;
}
