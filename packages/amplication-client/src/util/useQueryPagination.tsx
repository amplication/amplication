import { useEffect, useState } from "react";
import { MetaQueryPayload } from "../models";

export function useQueryPagination<T>() {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(30);

  const [currentPageData, setCurrentPageData] = useState<T[]>([]);
  const [meta, setMeta] = useState<MetaQueryPayload>({ count: 0 });

  const queryPaginationParams = {
    take: pageSize,
    skip: (pageNumber - 1) * pageSize,
  };

  const pageCount = meta.count > 0 ? Math.ceil(meta.count / pageSize) : 1;

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
    },
    queryPaginationParams,
    setCurrentPageData,
    currentPageData,
    setMeta,
  };
}
