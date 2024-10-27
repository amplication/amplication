import { ArgsType, Field, Int } from "@nestjs/graphql";
import { TeamOrderByInput } from "./TeamOrderByInput";
import { TeamWhereInput } from "./TeamWhereInput";

@ArgsType()
export class TeamFindManyArgs {
  @Field(() => TeamWhereInput, { nullable: true })
  where?: TeamWhereInput;

  @Field(() => TeamOrderByInput, { nullable: true })
  orderBy?: TeamOrderByInput;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
