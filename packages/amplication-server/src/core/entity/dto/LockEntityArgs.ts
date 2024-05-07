import { ArgsType, Field } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";

@ArgsType()
export class LockEntityArgs {
  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
