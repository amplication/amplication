import { Field, ObjectType } from "@nestjs/graphql";
import { IBlock } from "../../../models";

@ObjectType({
  isAbstract: true,
  implements: [IBlock],
})
export class Package extends IBlock {
  @Field(() => String, {
    nullable: false,
  })
  summary!: string;
}
