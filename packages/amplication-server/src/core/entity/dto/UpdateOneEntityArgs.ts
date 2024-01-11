import { WhereUniqueInput } from "../../../dto";
import { EntityUpdateInput } from "./EntityUpdateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class UpdateOneEntityArgs {
  @Field(() => EntityUpdateInput, { nullable: false })
  data!: EntityUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
