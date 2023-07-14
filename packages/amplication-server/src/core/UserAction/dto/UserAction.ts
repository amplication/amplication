import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import type { JsonValue } from "type-fest";
import { Action } from "../../action/dto/Action";
import { Resource, User } from "../../../models";
import { EnumUserActionStatus, EnumUserActionType } from "../types";

@ObjectType({
  isAbstract: true,
})
export class UserAction {
  @Field(() => String, {
    nullable: false,
  })
  id!: string;

  @Field(() => Date, {
    nullable: false,
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: false,
  })
  updatedAt!: Date;

  @Field(() => String, { nullable: false })
  resourceId!: string;

  @Field(() => Resource, { nullable: true })
  resource?: Resource;

  @Field(() => String, {
    nullable: false,
  })
  userId!: string;

  @Field(() => User)
  user?: User;

  @Field(() => String)
  actionId: string;

  @Field(() => Action, {
    nullable: true,
  })
  action?: Action;

  @Field(() => EnumUserActionType, {
    nullable: false,
  })
  userActionType!: keyof typeof EnumUserActionType;

  @Field(() => EnumUserActionStatus, {
    nullable: true,
  })
  status?: keyof typeof EnumUserActionStatus;

  @Field(() => GraphQLJSONObject, { nullable: true })
  metadata?: JsonValue;
}
