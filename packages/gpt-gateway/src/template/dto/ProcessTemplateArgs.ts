import { ArgsType, Field } from "@nestjs/graphql";
import { ProcessTemplateInput } from "./ProcessTemplateInput";

@ArgsType()
class ProcessTemplateArgs {
  @Field(() => ProcessTemplateInput, { nullable: false })
  data!: ProcessTemplateInput;
}

export { ProcessTemplateArgs };
