import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import type { JsonValue } from "type-fest";
import { IBlock } from "../../../models";

@ObjectType({
  implements: IBlock,
  isAbstract: true,
})
export class ResourceSettings extends IBlock {
  @Field(() => GraphQLJSONObject, {
    nullable: true,
  })
  properties?: JsonValue;
}
