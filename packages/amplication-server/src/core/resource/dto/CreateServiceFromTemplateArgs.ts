import { ArgsType, Field } from "@nestjs/graphql";
import { ServiceFromTemplateCreateInput } from "./ServiceFromTemplateCreateInput";

@ArgsType()
export class CreateServiceFromTemplateArgs {
  @Field(() => ServiceFromTemplateCreateInput, { nullable: false })
  data!: ServiceFromTemplateCreateInput;
}
