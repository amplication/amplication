import { Field, ObjectType } from "@nestjs/graphql";
import { Block } from "../../../models/Block";

@ObjectType({
  isAbstract: true,
})
export class ResourceVersionsDiffBlock {
  @Field(() => Block, { nullable: false })
  sourceBlock: Block;

  @Field(() => Block, { nullable: false })
  targetBlock: Block;
}
