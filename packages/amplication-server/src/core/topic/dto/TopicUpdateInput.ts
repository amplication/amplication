import { Field, InputType } from "@nestjs/graphql";
import { BlockUpdateInput } from "../../block/dto/BlockUpdateInput";

@InputType({
  isAbstract: true,
})
export class TopicUpdateInput extends BlockUpdateInput {
  @Field(() => String, {
    nullable: true,
  })
  name!: string | null;
}
