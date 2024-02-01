import { ArgsType, Field } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";
import { CodeGeneratorVersionUpdateInput } from "./CodeGeneratorVersionUpdateInput";

@ArgsType()
export class UpdateCodeGeneratorVersionArgs {
  @Field(() => CodeGeneratorVersionUpdateInput, { nullable: false })
  data!: CodeGeneratorVersionUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
