import { EnumMessagePatternConnectionOptions } from "./EnumMessagePatternConnectionOptions";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class MessagePattern {
  @Field(() => String, { nullable: false })
  topicId!: string;

  @Field(() => EnumMessagePatternConnectionOptions, { nullable: false })
  type!: EnumMessagePatternConnectionOptions;
}
