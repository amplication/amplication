import { ArgsType, Field } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";
import { PluginSetOrderInput } from "./PluginSetOrderInput";

@ArgsType()
export class SetPluginOrderArgs {
  @Field(() => PluginSetOrderInput, { nullable: false })
  data!: PluginSetOrderInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
