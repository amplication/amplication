import { Field, InputType } from "@nestjs/graphql";
import { BlockCreateInput } from "../../block/dto/BlockCreateInput";

@InputType({
  isAbstract: true,
})
export class RelationCreateInput extends BlockCreateInput {
  @Field(() => String, {
    nullable: false,
  })
  relationKey!: string;

  @Field(() => [String], {
    nullable: false,
  })
  relatedResources!: string[];
}
