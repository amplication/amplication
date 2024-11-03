import { ArgsType, Field, Int } from "@nestjs/graphql";
import { CustomPropertyOrderByInput } from "./CustomPropertyOrderByInput";
import { CustomPropertyWhereInput } from "./CustomPropertyWhereInput";

@ArgsType()
export class CustomPropertyFindManyArgs {
  @Field(() => CustomPropertyWhereInput, { nullable: true })
  where?: CustomPropertyWhereInput;

  @Field(() => CustomPropertyOrderByInput, { nullable: true })
  orderBy?: CustomPropertyOrderByInput;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
