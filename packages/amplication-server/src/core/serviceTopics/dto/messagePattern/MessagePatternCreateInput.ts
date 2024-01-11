import { EnumMessagePatternConnectionOptions } from "./EnumMessagePatternConnectionOptions";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class MessagePatternCreateInput {
  @Field(() => String, { nullable: false })
  topicId!: string;

  @Field(() => EnumMessagePatternConnectionOptions, { nullable: false })
  type!: keyof typeof EnumMessagePatternConnectionOptions;
}
