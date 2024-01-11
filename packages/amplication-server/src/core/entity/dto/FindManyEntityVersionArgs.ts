import { EntityVersionOrderByInput } from "./EntityVersionOrderByInput";
import { EntityVersionWhereInput } from "./EntityVersionWhereInput";
import { ArgsType, Field, Int } from "@nestjs/graphql";

@ArgsType()
export class FindManyEntityVersionArgs {
  @Field(() => EntityVersionWhereInput, { nullable: true })
  where?: EntityVersionWhereInput | null;

  @Field(() => EntityVersionOrderByInput, { nullable: true })
  orderBy?: EntityVersionOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
