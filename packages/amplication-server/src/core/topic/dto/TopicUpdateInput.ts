import { BlockUpdateInput } from "../../block/dto/BlockUpdateInput";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class TopicUpdateInput extends BlockUpdateInput {
  @Field(() => String, {
    nullable: true,
  })
  name!: string | null;
}
