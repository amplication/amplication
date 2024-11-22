import { ArgsType, Field } from "@nestjs/graphql";
import { UpdateBlockArgs } from "../../block/dto/UpdateBlockArgs";
import { RelationUpdateInput } from "./RelationUpdateInput";

@ArgsType()
export class UpdateRelationArgs extends UpdateBlockArgs {
  @Field(() => RelationUpdateInput, { nullable: false })
  declare data: RelationUpdateInput;
}
