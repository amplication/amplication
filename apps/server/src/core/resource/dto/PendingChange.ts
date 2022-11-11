import { Field, Int, ObjectType } from "@nestjs/graphql";
import { EnumPendingChangeAction } from "./EnumPendingChangeAction";
import { Entity } from "../../../models/Entity";
import { Block } from "../../../models/Block";
import { EnumPendingChangeOriginType } from "./EnumPendingChangeOriginType";
import { PendingChangeOrigin } from "./PendingChangeOrigin";
import { Resource } from "../../../models";

@ObjectType({
  isAbstract: true,
})
export class PendingChange {
  @Field(() => EnumPendingChangeAction, {
    nullable: false,
  })
  action: EnumPendingChangeAction;

  @Field(() => EnumPendingChangeOriginType, {
    nullable: false,
  })
  originType: EnumPendingChangeOriginType;

  @Field(() => String, {
    nullable: false,
  })
  originId!: string;

  @Field(() => PendingChangeOrigin, {
    nullable: false,
  })
  origin: Entity | Block;

  @Field(() => Int, {
    nullable: false,
  })
  versionNumber!: number;

  @Field(() => Resource, { nullable: false })
  resource!: Resource;
}
