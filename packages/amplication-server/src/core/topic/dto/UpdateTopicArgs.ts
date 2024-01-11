import { UpdateBlockArgs } from "../../block/dto/UpdateBlockArgs";
import { TopicUpdateInput } from "./TopicUpdateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class UpdateTopicArgs extends UpdateBlockArgs {
  @Field(() => TopicUpdateInput, { nullable: false })
  declare data: TopicUpdateInput;
}
