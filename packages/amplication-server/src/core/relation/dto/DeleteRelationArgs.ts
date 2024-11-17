import { ArgsType, Field } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";

@ArgsType()
export class DeleteRelationArgs {
  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
