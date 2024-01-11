import { IBlock } from "../../../models";
import { Field, ObjectType } from "@nestjs/graphql";

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
