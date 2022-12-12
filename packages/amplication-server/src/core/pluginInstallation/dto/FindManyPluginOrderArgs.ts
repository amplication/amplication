import { ArgsType, Field, Int } from "@nestjs/graphql";
import { PluginOrderOrderByInput } from "./PluginOrderOrderByInput";
import { PluginOrderWhereInput } from "./PluginOrderWhereInput";

@ArgsType()
export class FindManyPluginOrderArgs {
  @Field(() => PluginOrderWhereInput, { nullable: true })
  where?: PluginOrderWhereInput | null;

  @Field(() => PluginOrderOrderByInput, { nullable: true })
  orderBy?: PluginOrderOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
