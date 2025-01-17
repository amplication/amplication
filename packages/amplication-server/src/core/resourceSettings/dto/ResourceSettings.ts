import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import type { JsonValue } from "type-fest";
import { IBlock } from "../../../models";
import { ServiceTemplateVersion } from "../../serviceSettings/dto/ServiceTemplateVersion";

@ObjectType({
  implements: IBlock,
  isAbstract: true,
})
export class ResourceSettings extends IBlock {
  @Field(() => GraphQLJSONObject, {
    nullable: true,
  })
  properties?: JsonValue;

  @Field(() => ServiceTemplateVersion, {
    nullable: true,
  })
  serviceTemplateVersion?: ServiceTemplateVersion & JsonValue;
}
