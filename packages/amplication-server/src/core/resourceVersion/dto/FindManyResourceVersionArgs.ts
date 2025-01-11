import { Field, ArgsType, Int } from "@nestjs/graphql";
import { ResourceVersionOrderByInput } from "./ResourceVersionOrderByInput";
import { ResourceVersionWhereInput } from "./ResourceVersionWhereInput";

@ArgsType()
export class FindManyResourceVersionArgs {
  @Field(() => ResourceVersionWhereInput, { nullable: true })
  where?: ResourceVersionWhereInput | null | undefined;

  @Field(() => ResourceVersionOrderByInput, { nullable: true })
  orderBy?: ResourceVersionOrderByInput | null | undefined;

  @Field(() => Int, { nullable: true })
  take?: number | null | undefined;

  @Field(() => Int, { nullable: true })
  skip?: number | null | undefined;
}
