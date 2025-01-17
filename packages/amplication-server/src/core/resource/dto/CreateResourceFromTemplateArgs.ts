import { ArgsType, Field } from "@nestjs/graphql";
import { ResourceFromTemplateCreateInput } from "./ResourceFromTemplateCreateInput";

@ArgsType()
export class CreateResourceFromTemplateArgs {
  @Field(() => ResourceFromTemplateCreateInput, { nullable: false })
  data!: ResourceFromTemplateCreateInput;
}
