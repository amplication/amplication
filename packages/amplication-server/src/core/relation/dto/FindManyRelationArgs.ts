import { ArgsType, Field, Int } from "@nestjs/graphql";
import { RelationOrderByInput } from "./RelationOrderByInput";
import { RelationWhereInput } from "./RelationWhereInput";

@ArgsType()
export class FindManyRelationArgs {
  @Field(() => RelationWhereInput, { nullable: true })
  where?: RelationWhereInput | null;

  @Field(() => RelationOrderByInput, { nullable: true })
  orderBy?: RelationOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
