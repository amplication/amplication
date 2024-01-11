import { WhereUniqueInput } from "../../../dto";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class FindOneResourceRoleArgs {
  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;

  @Field(() => Number, { nullable: true })
  version: number;
}
