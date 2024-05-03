import { ArgsType, Field } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";

@ArgsType()
export class UpdateCodeGeneratorTechnologyArgs {
  @Field(() => String, {
    nullable: false,
  })
  codeGeneratorName!: string;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
