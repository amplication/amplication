import { EntityFieldCreateByDisplayNameInput } from "./EntityFieldCreateByDisplayNameInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreateOneEntityFieldByDisplayNameArgs {
  @Field(() => EntityFieldCreateByDisplayNameInput, { nullable: false })
  data!: EntityFieldCreateByDisplayNameInput;
}
