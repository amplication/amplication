import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import type { JsonValue } from "type-fest";

@ObjectType({
  isAbstract: true,
})
export class PrivatePluginVersion {
  @Field(() => String, {
    nullable: false,
  })
  version!: string;

  @Field(() => GraphQLJSONObject, {
    nullable: true,
  })
  settings?: JsonValue;

  @Field(() => GraphQLJSONObject, {
    nullable: true,
  })
  configurations?: JsonValue;

  @Field(() => Boolean, {
    nullable: false,
  })
  deprecated!: boolean;

  @Field(() => Boolean, {
    nullable: false,
  })
  enabled!: boolean;
}
