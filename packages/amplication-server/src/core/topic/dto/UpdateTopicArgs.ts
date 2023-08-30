import { ArgsType, Field } from "@nestjs/graphql";
import { UpdateBlockArgs } from "../../block/dto/UpdateBlockArgs";
import { TopicUpdateInput } from "./TopicUpdateInput";

@ArgsType()
export class UpdateTopicArgs extends UpdateBlockArgs {
  @Field(() => TopicUpdateInput, { nullable: false })
  declare data: TopicUpdateInput;
}
