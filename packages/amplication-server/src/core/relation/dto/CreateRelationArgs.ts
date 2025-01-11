import { ArgsType, Field } from "@nestjs/graphql";
import { RelationCreateInput } from "./RelationCreateInput";

@ArgsType()
export class CreateRelationArgs {
  @Field(() => RelationCreateInput, { nullable: false })
  data!: RelationCreateInput;
}
