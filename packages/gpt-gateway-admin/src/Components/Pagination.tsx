import React from "react";
import { Pagination as RAPagination, PaginationProps } from "react-admin";

const PAGINATION_OPTIONS = [10, 25, 50, 100, 200];

const Pagination = (props: PaginationProps) => (
  <RAPagination rowsPerPageOptions={PAGINATION_OPTIONS} {...props} />
);

export default Pagination;
