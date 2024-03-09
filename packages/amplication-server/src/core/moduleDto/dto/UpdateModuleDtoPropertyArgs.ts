import { ArgsType, Field } from "@nestjs/graphql";
import { ModuleDtoPropertyUpdateInput } from "./ModuleDtoPropertyUpdateInput";
import { WherePropertyUniqueInput } from "./WherePropertyUniqueInput";

@ArgsType()
export class UpdateModuleDtoPropertyArgs {
  @Field(() => WherePropertyUniqueInput, { nullable: false })
  where!: WherePropertyUniqueInput;

  @Field(() => ModuleDtoPropertyUpdateInput, { nullable: false })
  data: ModuleDtoPropertyUpdateInput;
}
