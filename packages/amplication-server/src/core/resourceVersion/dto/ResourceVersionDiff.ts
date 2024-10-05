import { Field, ObjectType } from "@nestjs/graphql";
import { Block } from "../../../models/Block";
import { ResourceVersionDiffBlock } from "./ResourceVersionDiffBlock";

@ObjectType({
  isAbstract: true,
})
export class ResourceVersionDiff {
  @Field(() => [ResourceVersionDiffBlock], { nullable: true })
  updatedBlocks?: ResourceVersionDiffBlock[] | null | undefined;

  @Field(() => [Block], { nullable: true })
  createdBlocks?: Block[] | null | undefined;

  @Field(() => [Block], { nullable: true })
  deletedBlocks?: Block[] | null | undefined;
}
