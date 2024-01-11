import { WhereUniqueInput } from "../../../dto";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class DeleteOneEntityArgs {
  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
