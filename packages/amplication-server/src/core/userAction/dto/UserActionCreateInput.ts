import { WhereParentIdInput } from "../../../dto";
import { EnumUserActionType } from "../types";
import { InputType, Field } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import type { JsonValue } from "type-fest";

@InputType({
  isAbstract: true,
})
export class UserActionCreateInput {
  // Do not expose, injected by the context
  user: WhereParentIdInput;

  @Field(() => EnumUserActionType, { nullable: false })
  userActionType!: EnumUserActionType;

  @Field(() => GraphQLJSONObject, { nullable: true })
  metadata?: JsonValue;

  @Field(() => WhereParentIdInput, { nullable: true })
  resource?: WhereParentIdInput;
}
