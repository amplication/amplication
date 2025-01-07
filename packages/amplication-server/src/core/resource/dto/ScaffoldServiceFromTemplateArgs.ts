import { ArgsType, Field } from "@nestjs/graphql";
import { ScaffoldServiceFromTemplateInput } from "./ScaffoldServiceFromTemplateInput";

@ArgsType()
export class ScaffoldServiceFromTemplateArgs {
  @Field(() => ScaffoldServiceFromTemplateInput, { nullable: false })
  data!: ScaffoldServiceFromTemplateInput;
}
