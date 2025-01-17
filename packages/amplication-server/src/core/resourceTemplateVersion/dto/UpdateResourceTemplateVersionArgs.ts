import { ArgsType, Field } from "@nestjs/graphql";
import { UpdateBlockArgs } from "../../block/dto/UpdateBlockArgs";
import { ResourceTemplateVersionUpdateInput } from "./ResourceTemplateVersionUpdateInput";

@ArgsType()
export class UpdateResourceTemplateVersionArgs extends UpdateBlockArgs {
  @Field(() => ResourceTemplateVersionUpdateInput, { nullable: false })
  declare data: ResourceTemplateVersionUpdateInput;
}
