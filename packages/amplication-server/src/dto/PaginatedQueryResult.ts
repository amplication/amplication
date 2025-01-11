import { ObjectType, Field, Int } from "@nestjs/graphql";
import { Resource } from "../models";

function paginatedQueryResult<T>(classRef: T): any {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [classRef], { nullable: true })
    data: T[];

    @Field(() => Int)
    totalCount: number;
  }

  return PaginatedType;
}

@ObjectType()
export class PaginatedResourceQueryResult extends paginatedQueryResult(
  Resource
) {}
