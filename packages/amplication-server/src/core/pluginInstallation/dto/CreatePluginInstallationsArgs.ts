import { ArgsType, Field } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";
import { PluginInstallationsCreateInput } from "./PluginInstallationsCreateInput";

@ArgsType()
export class CreatePluginInstallationsArgs {
  @Field(() => PluginInstallationsCreateInput, { nullable: false })
  data!: PluginInstallationsCreateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
