import { TopicCreateInput } from "./TopicCreateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreateTopicArgs {
  @Field(() => TopicCreateInput, { nullable: false })
  data!: TopicCreateInput;
}
