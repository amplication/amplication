import { PluginInstallationOrderByInput } from "./PluginInstallationOrderByInput";
import { PluginInstallationWhereInput } from "./PluginInstallationWhereInput";
import { ArgsType, Field, Int } from "@nestjs/graphql";

@ArgsType()
export class FindManyPluginInstallationArgs {
  @Field(() => PluginInstallationWhereInput, { nullable: true })
  where?: PluginInstallationWhereInput | null;

  @Field(() => PluginInstallationOrderByInput, { nullable: true })
  orderBy?: PluginInstallationOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
