import { Field, ObjectType } from "@nestjs/graphql";
import { BlockVersion } from "../../../models";
import { ResourceVersionsDiffBlock } from "./ResourceVersionsDiffBlock";

@ObjectType({
  isAbstract: true,
})
export class ResourceVersionsDiff {
  @Field(() => [ResourceVersionsDiffBlock], { nullable: true })
  updatedBlocks?: ResourceVersionsDiffBlock[] | null | undefined;

  @Field(() => [BlockVersion], { nullable: true })
  createdBlocks?: BlockVersion[] | null | undefined;

  @Field(() => [BlockVersion], { nullable: true })
  deletedBlocks?: BlockVersion[] | null | undefined;
}
