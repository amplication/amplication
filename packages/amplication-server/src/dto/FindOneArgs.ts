import { WhereUniqueInput } from "../dto/WhereUniqueInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class FindOneArgs {
  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
