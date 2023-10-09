import { ArgsType, Field, Int } from "@nestjs/graphql";
import { ModuleActionOrderByInput } from "./ModuleActionOrderByInput";
import { ModuleActionWhereInput } from "./ModuleActionWhereInput";

@ArgsType()
export class FindManyModuleActionArgs {
  @Field(() => ModuleActionWhereInput, { nullable: true })
  where?: ModuleActionWhereInput | null;

  @Field(() => ModuleActionOrderByInput, { nullable: true })
  orderBy?: ModuleActionOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
