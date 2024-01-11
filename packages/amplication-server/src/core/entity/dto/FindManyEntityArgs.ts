import { EntityOrderByInput } from "./EntityOrderByInput";
import { EntityWhereInput } from "./EntityWhereInput";
import { ArgsType, Field, Int } from "@nestjs/graphql";

@ArgsType()
export class FindManyEntityArgs {
  @Field(() => EntityWhereInput, { nullable: true })
  where?: EntityWhereInput | null;

  @Field(() => EntityOrderByInput, { nullable: true })
  orderBy?: EntityOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
