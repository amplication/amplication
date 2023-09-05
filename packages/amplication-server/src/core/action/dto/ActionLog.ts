import { GraphQLJSONObject } from "graphql-type-json";
import type { JsonValue } from "type-fest";
import { ObjectType, Field } from "@nestjs/graphql";
import { EnumActionLogLevel } from "./EnumActionLogLevel";

const DEFAULT_VALUES: ActionLog = {
  id: "",
  createdAt: new Date(),
  message: "",
  meta: {},
  level: EnumActionLogLevel.Info,
};

@ObjectType({
  isAbstract: true,
})
export class ActionLog {
  constructor(init?: Partial<ActionLog>) {
    if (init) {
      Object.assign(this, DEFAULT_VALUES, { createdAt: new Date() }, init);
    }
  }

  @Field(() => String, {})
  id!: string;

  @Field(() => Date, {})
  createdAt!: Date;

  @Field(() => String)
  message!: string;

  @Field(() => GraphQLJSONObject)
  meta!: JsonValue;

  @Field(() => EnumActionLogLevel)
  level!: keyof typeof EnumActionLogLevel;
}
