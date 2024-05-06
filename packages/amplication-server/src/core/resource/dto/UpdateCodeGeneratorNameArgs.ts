import { ArgsType, Field } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";

@ArgsType()
export class UpdateCodeGeneratorNameArgs {
  @Field(() => String, {
    nullable: false,
  })
  codeGeneratorName!: string;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
