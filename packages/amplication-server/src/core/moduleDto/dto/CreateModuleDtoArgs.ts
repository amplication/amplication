import { ArgsType, Field } from "@nestjs/graphql";
import { ModuleDtoCreateInput } from "./ModuleDtoCreateInput";
import { ModuleDtoProperty } from "./ModuleDtoProperty";

@ArgsType()
export class CreateModuleDtoArgs {
  @Field(() => ModuleDtoCreateInput, { nullable: false })
  data!: ModuleDtoCreateInput;

  @Field(() => [ModuleDtoProperty], { nullable: true })
  properties?: ModuleDtoProperty[];
}
