import { ArgsType, Field } from "@nestjs/graphql";
import { ModuleDtoPropertyCreateInput } from "./ModuleDtoPropertyCreateInput";

@ArgsType()
export class CreateModuleDtoPropertyArgs {
  @Field(() => ModuleDtoPropertyCreateInput, { nullable: false })
  data!: ModuleDtoPropertyCreateInput;
}
