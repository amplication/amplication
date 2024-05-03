import { ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PaginationResult<ResultType> {
  result!: ResultType[];
  success!: boolean;
  count!: number;
}
