import { Field, InputType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import type { JsonValue } from "type-fest";
import { BlockCreateInput } from "../../block/dto/BlockCreateInput";

@InputType({
  isAbstract: true,
})
export class PluginInstallationCreateInput extends BlockCreateInput {
  @Field(() => String, {
    nullable: false,
  })
  pluginId!: string;

  @Field(() => Boolean, {
    nullable: false,
  })
  enabled: boolean;

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
