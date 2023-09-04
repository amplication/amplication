export class PaginationLimit extends Error {
  constructor(limit: number) {
    super(`Pagination limit must be between 1-100, got ${limit} instead`);
  }
}
