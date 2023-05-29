import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
})
export class Pagination {
  @Field(() => Number)
  page: number | null;

  @Field(() => Number)
  perPage: number | null;
}
