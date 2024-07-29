import { ArgsType, Field, Int } from "@nestjs/graphql";
import { PrivatePluginOrderByInput } from "./PrivatePluginOrderByInput";
import { PrivatePluginWhereInput } from "./PrivatePluginWhereInput";

@ArgsType()
export class FindManyPrivatePluginArgs {
  @Field(() => PrivatePluginWhereInput, { nullable: true })
  where?: PrivatePluginWhereInput | null;

  @Field(() => PrivatePluginOrderByInput, { nullable: true })
  orderBy?: PrivatePluginOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
