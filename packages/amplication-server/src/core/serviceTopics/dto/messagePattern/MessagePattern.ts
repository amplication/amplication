import { Field, ObjectType } from "@nestjs/graphql";
import { EnumMessagePatternConnectionOptions } from "./EnumMessagePatternConnectionOptions";

@ObjectType()
export class MessagePattern {
  @Field(() => String, { nullable: false })
  topicId!: string;

  @Field(() => EnumMessagePatternConnectionOptions, { nullable: false })
  type!: EnumMessagePatternConnectionOptions;
}
