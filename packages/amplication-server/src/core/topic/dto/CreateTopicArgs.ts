import { ArgsType, Field } from "@nestjs/graphql";
import { TopicCreateInput } from "./TopicCreateInput";

@ArgsType()
export class CreateTopicArgs {
  @Field(() => TopicCreateInput, { nullable: false })
  data!: TopicCreateInput;
}
