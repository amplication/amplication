import { Field, ObjectType } from "@nestjs/graphql";
import { IBlock } from "../../../models";

@ObjectType({
  isAbstract: true,
  implements: [IBlock],
})
export class Topic extends IBlock {
  @Field(() => String, {
    nullable: false,
  })
  name!: string;
}
