import { ArgsType, Field } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";
import { CustomPropertyUpdateInput } from "./CustomPropertyUpdateInput";

@ArgsType()
export class UpdateCustomPropertyArgs {
  @Field(() => CustomPropertyUpdateInput, { nullable: false })
  data!: CustomPropertyUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
