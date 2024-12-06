import { Field, InputType } from "@nestjs/graphql";
import { BlockUpdateInput } from "../../block/dto/BlockUpdateInput";
import { GraphQLJSONObject } from "graphql-type-json";
import { JsonValue } from "type-fest";

@InputType({
  isAbstract: true,
})
export class ResourceSettingsUpdateInput extends BlockUpdateInput {
  @Field(() => GraphQLJSONObject, {
    nullable: true,
  })
  properties?: JsonValue | null;
}
