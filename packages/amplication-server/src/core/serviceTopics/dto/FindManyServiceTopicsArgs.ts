import { ServiceTopicsOrderByInput } from "./ServiceTopicsOrderByInput";
import { ServiceTopicsWhereInput } from "./ServiceTopicsWhereInput";
import { ArgsType, Field, Int } from "@nestjs/graphql";

@ArgsType()
export class FindManyServiceTopicsArgs {
  @Field(() => ServiceTopicsWhereInput, { nullable: true })
  where?: ServiceTopicsWhereInput | null;

  @Field(() => ServiceTopicsOrderByInput, { nullable: true })
  orderBy?: ServiceTopicsOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
