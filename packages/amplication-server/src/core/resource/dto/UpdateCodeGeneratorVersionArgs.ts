import { WhereUniqueInput } from "../../../dto";
import { CodeGeneratorVersionUpdateInput } from "./CodeGeneratorVersionUpdateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class UpdateCodeGeneratorVersionArgs {
  @Field(() => CodeGeneratorVersionUpdateInput, { nullable: false })
  data!: CodeGeneratorVersionUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
