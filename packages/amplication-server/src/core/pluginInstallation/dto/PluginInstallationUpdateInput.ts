import { Field, InputType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import type { JsonValue } from "type-fest";
import { BlockUpdateInput } from "../../block/dto/BlockUpdateInput";

@InputType({
  isAbstract: true,
})
export class PluginInstallationUpdateInput extends BlockUpdateInput {
  @Field(() => Boolean, {
    nullable: false,
  })
  enabled!: boolean;

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

  pluginId!: string; //This field is set by the service, do not expose to the API

  npm!: string;
}
