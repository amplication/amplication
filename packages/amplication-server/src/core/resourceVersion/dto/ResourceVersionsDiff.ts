import { Field, ObjectType } from "@nestjs/graphql";
import { Block } from "../../../models/Block";
import { ResourceVersionsDiffBlock } from "./ResourceVersionsDiffBlock";

@ObjectType({
  isAbstract: true,
})
export class ResourceVersionsDiff {
  @Field(() => [ResourceVersionsDiffBlock], { nullable: true })
  updatedBlocks?: ResourceVersionsDiffBlock[] | null | undefined;

  @Field(() => [Block], { nullable: true })
  createdBlocks?: Block[] | null | undefined;

  @Field(() => [Block], { nullable: true })
  deletedBlocks?: Block[] | null | undefined;
}
