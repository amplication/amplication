import { BlockOrderByInput } from "./BlockOrderByInput";
import { BlockWhereInput } from "./BlockWhereInput";
import { ArgsType, Field, Int } from "@nestjs/graphql";

@ArgsType()
export class FindManyBlockArgs {
  @Field(() => BlockWhereInput, { nullable: true })
  where?: BlockWhereInput | null;

  @Field(() => BlockOrderByInput, { nullable: true })
  orderBy?: BlockOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
