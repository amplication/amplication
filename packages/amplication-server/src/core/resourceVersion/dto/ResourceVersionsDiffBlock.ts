import { Field, ObjectType } from "@nestjs/graphql";
import { BlockVersion } from "../../../models/BlockVersion";

@ObjectType({
  isAbstract: true,
})
export class ResourceVersionsDiffBlock {
  @Field(() => BlockVersion, { nullable: false })
  sourceBlockVersion: BlockVersion;

  @Field(() => BlockVersion, { nullable: false })
  targetBlockVersion: BlockVersion;
}
