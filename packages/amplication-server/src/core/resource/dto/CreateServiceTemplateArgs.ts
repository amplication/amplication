import { ArgsType, Field } from "@nestjs/graphql";
import { ServiceTemplateCreateInput } from "./ServiceTemplateCreateInput";

@ArgsType()
export class CreateServiceTemplateArgs {
  @Field(() => ServiceTemplateCreateInput, { nullable: false })
  data!: ServiceTemplateCreateInput;
}
