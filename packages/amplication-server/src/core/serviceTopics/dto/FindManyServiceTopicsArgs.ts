import { ArgsType, Field, Int } from "@nestjs/graphql";
import { ServiceTopicsOrderByInput } from "./ServiceTopicsOrderByInput";
import { ServiceTopicsWhereInput } from "./ServiceTopicsWhereInput";

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
