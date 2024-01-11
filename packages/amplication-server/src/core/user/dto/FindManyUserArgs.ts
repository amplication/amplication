import { UserOrderByInput } from "./UserOrderByInput";
import { UserWhereInput } from "./UserWhereInput";
import { ArgsType, Field, Int } from "@nestjs/graphql";

@ArgsType()
export class FindManyUserArgs {
  @Field(() => UserWhereInput, { nullable: true })
  where?: UserWhereInput | null;

  @Field(() => UserOrderByInput, { nullable: true })
  orderBy?: UserOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
