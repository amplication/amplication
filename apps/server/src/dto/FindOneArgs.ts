import { ArgsType, Field } from "@nestjs/graphql";
import { WhereUniqueInput } from "./WhereUniqueInput";

@ArgsType()
export class FindOneArgs {
  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
