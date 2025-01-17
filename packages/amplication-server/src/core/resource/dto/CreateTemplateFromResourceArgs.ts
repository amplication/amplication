import { ArgsType, Field } from "@nestjs/graphql";
import { CreateTemplateFromResourceInput } from "./CreateTemplateFromResourceInput";

@ArgsType()
export class CreateTemplateFromResourceArgs {
  @Field(() => CreateTemplateFromResourceInput, { nullable: false })
  data!: CreateTemplateFromResourceInput;
}
