import { Field, ObjectType } from "@nestjs/graphql";
import { IBlock } from "../../../models";

@ObjectType({
  isAbstract: true,
  implements: [IBlock],
})
export class Relation extends IBlock {
  @Field(() => String, {
    nullable: false,
  })
  relationKey!: string;

  @Field(() => [String], {
    nullable: false,
  })
  relatedResources!: string[];
}
