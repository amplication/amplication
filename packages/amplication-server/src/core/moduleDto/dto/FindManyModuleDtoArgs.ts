import { ArgsType, Field, Int } from "@nestjs/graphql";
import { ModuleDtoOrderByInput } from "./ModuleDtoOrderByInput";
import { ModuleDtoWhereInput } from "./ModuleDtoWhereInput";

@ArgsType()
export class FindManyModuleDtoArgs {
  @Field(() => ModuleDtoWhereInput, { nullable: true })
  where?: ModuleDtoWhereInput | null;

  @Field(() => ModuleDtoOrderByInput, { nullable: true })
  orderBy?: ModuleDtoOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
