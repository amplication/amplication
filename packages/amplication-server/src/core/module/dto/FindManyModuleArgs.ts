import { ArgsType, Field, Int } from "@nestjs/graphql";
import { ModuleOrderByInput } from "./ModuleOrderByInput";
import { ModuleWhereInput } from "./ModuleWhereInput";

@ArgsType()
export class FindManyModuleArgs {
  @Field(() => ModuleWhereInput, { nullable: true })
  where?: ModuleWhereInput | null;

  @Field(() => ModuleOrderByInput, { nullable: true })
  orderBy?: ModuleOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
