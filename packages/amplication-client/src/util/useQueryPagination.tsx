import { useCallback, useEffect, useState } from "react";
import { MetaQueryPayload } from "../models";
import { set } from "lodash";

type Props = {
  onLoadMore?: () => void;
  initialPageSize?: number;
};

export type Pagination = {
  pageNumber: number;
  setPageNumber: (pageNumber: number) => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  pageCount: number;
  recordCount: number;
  triggerLoadMore: () => void;
};

export type Sorting<R> = {
  orderBy: R;
  setOrderBy: (orderBy: R) => void;
};

export type QueryPagination<T, R extends any[]> = {
  pagination: Pagination;
  sorting: Sorting<R>;
  queryPaginationParams: {
    take: number;
    skip: number;
  };
  setCurrentPageData: (data: T[]) => void;
  currentPageData: T[];
  setMeta: (meta: MetaQueryPayload) => void;
};

export function useQueryPagination<T, R extends any[] = undefined>(
  props?: Props
): QueryPagination<T, R> {
  const { onLoadMore, initialPageSize } = props || {};

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(initialPageSize || 20);

  const [currentPageData, setCurrentPageData] = useState<T[]>([]);
  const [meta, setMeta] = useState<MetaQueryPayload>({ count: 0 });

  const [orderBy, setOrderBy] = useState<R>(undefined);

  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const queryPaginationParams = {
    take: pageSize,
    skip: (pageNumber - 1) * pageSize,
  };

  const pageCount = meta.count > 0 ? Math.ceil(meta.count / pageSize) : 1;

  const handleOrderBy = useCallback((orderBy: R) => {
    const preparedOrderBy = [] as R;

    //iterate over orderBy and replace keys with . notation to object
    console.log("orderBy", orderBy);

    orderBy?.forEach((item) => {
      const key = Object.keys(item)[0];
      const value = item[key];
      preparedOrderBy.push(set({}, key, value));
    });

    console.log("preparedOrderBy", preparedOrderBy);
    setOrderBy(preparedOrderBy);
    setPageNumber(1);
  }, []);

  const triggerLoadMore = useCallback(() => {
    if (isLoadingMore) {
      return;
    }

    if (pageNumber < pageCount) {
      setPageNumber(pageNumber + 1);
      onLoadMore && onLoadMore();
      setIsLoadingMore(true);
    }
  }, [isLoadingMore, onLoadMore, pageCount, pageNumber]);

  const setCurrentPageDataInternal = useCallback((data: T[]) => {
    setIsLoadingMore((loadMore) => {
      if (loadMore) {
        setCurrentPageData((prevData) => [...prevData, ...data]);
        return false;
      } else {
        setCurrentPageData(data);
        return false;
      }
    });
  }, []);

  useEffect(() => {
    if (pageNumber > pageCount) {
      setPageNumber(pageCount);
    }
  }, [pageCount, pageNumber, pageSize]);

  return {
    pagination: {
      pageNumber,
      setPageNumber,
      pageSize,
      setPageSize,
      pageCount,
      recordCount: meta.count,
      triggerLoadMore,
    },
    sorting: {
      orderBy,
      setOrderBy: handleOrderBy,
    },
    queryPaginationParams,
    setCurrentPageData: setCurrentPageDataInternal,
    currentPageData,
    setMeta,
  };
}
