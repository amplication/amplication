import { WhereUniqueInput } from "../../../dto";
import { PluginSetOrderInput } from "./PluginSetOrderInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class SetPluginOrderArgs {
  @Field(() => PluginSetOrderInput, { nullable: false })
  data!: PluginSetOrderInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
