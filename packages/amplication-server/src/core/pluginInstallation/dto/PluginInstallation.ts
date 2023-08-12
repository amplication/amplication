import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import type { JsonValue } from "type-fest";
import { IBlock } from "../../../models";

@ObjectType({
  isAbstract: true,
  implements: [IBlock],
})
export class PluginInstallation extends IBlock {
  @Field(() => String, {
    nullable: false,
  })
  pluginId!: string;

  @Field(() => Boolean, {
    nullable: false,
  })
  enabled!: boolean;

  @Field(() => String, {
    nullable: false,
  })
  npm!: string;

  @Field(() => GraphQLJSONObject, {
    nullable: true,
  })
  settings?: JsonValue;

  @Field(() => GraphQLJSONObject, {
    nullable: true,
  })
  configurations?: JsonValue;

  @Field(() => String, {
    nullable: false,
  })
  version!: string;
}
