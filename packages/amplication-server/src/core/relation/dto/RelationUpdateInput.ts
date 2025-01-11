import { Field, InputType } from "@nestjs/graphql";
import { BlockUpdateInput } from "../../block/dto/BlockUpdateInput";

@InputType({
  isAbstract: true,
})
export class RelationUpdateInput extends BlockUpdateInput {
  @Field(() => [String], {
    nullable: false,
  })
  relatedResources!: string[];
}
