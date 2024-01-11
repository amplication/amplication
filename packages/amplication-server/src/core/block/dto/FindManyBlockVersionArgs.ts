import { BlockVersionOrderByInput } from "./BlockVersionOrderByInput";
import { BlockVersionWhereInput } from "./BlockVersionWhereInput";
import { ArgsType, Field, Int } from "@nestjs/graphql";

@ArgsType()
export class FindManyBlockVersionArgs {
  @Field(() => BlockVersionWhereInput, { nullable: true })
  where?: BlockVersionWhereInput | null;

  @Field(() => BlockVersionOrderByInput, { nullable: true })
  orderBy?: BlockVersionOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
