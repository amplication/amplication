import { EntityFieldOrderByInput } from "./EntityFieldOrderByInput";
import { EntityFieldWhereInput } from "./EntityFieldWhereInput";
import { ArgsType, Field, Int } from "@nestjs/graphql";

@ArgsType()
export class FindManyEntityFieldArgs {
  @Field(() => EntityFieldWhereInput, { nullable: true })
  where?: EntityFieldWhereInput | null;

  @Field(() => EntityFieldOrderByInput, { nullable: true })
  orderBy?: EntityFieldOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
