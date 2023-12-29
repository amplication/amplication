import { ArgsType, Field, Int } from "@nestjs/graphql";
import { ModuleDtoPropertyOrderByInput } from "./ModuleDtoPropertyOrderByInput";
import { ModuleDtoPropertyWhereInput } from "./ModuleDtoPropertyWhereInput";

@ArgsType()
export class FindManyModuleDtoPropertyArgs {
  @Field(() => ModuleDtoPropertyWhereInput, { nullable: true })
  where?: ModuleDtoPropertyWhereInput | null;

  @Field(() => ModuleDtoPropertyOrderByInput, { nullable: true })
  orderBy?: ModuleDtoPropertyOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
