import { WhereUniqueInput } from "../../../dto";
import { PluginInstallationsCreateInput } from "./PluginInstallationsCreateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreatePluginInstallationsArgs {
  @Field(() => PluginInstallationsCreateInput, { nullable: false })
  data!: PluginInstallationsCreateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
