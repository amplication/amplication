import { Injectable } from "@nestjs/common";
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from "./constants";
import { PaginationQuery, PaginationResult } from "./dto";

@Injectable()
export class PaginationService {
  paginate<ResultType>(
    results: any[],
    query: PaginationQuery
  ): PaginationResult<ResultType> {
    const page = query.page || DEFAULT_PAGE;
    const perPage = query.per_page || DEFAULT_PER_PAGE;

    const startPosition = page * perPage;
    const finalPosition = startPosition + perPage;
    const resultsAfterSkip = results.slice(startPosition, finalPosition);

    const count = resultsAfterSkip.length;

    return { result: resultsAfterSkip, success: true, count };
  }
}
