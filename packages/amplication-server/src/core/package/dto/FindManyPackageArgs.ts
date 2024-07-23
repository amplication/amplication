import { ArgsType, Field, Int } from "@nestjs/graphql";
import { PackageOrderByInput } from "./PackageOrderByInput";
import { PackageWhereInput } from "./PackageWhereInput";

@ArgsType()
export class FindManyPackageArgs {
  @Field(() => PackageWhereInput, { nullable: true })
  where?: PackageWhereInput | null;

  @Field(() => PackageOrderByInput, { nullable: true })
  orderBy?: PackageOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
