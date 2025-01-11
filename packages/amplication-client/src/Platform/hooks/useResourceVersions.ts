import { useQuery } from "@apollo/client";
import { useState } from "react";
import * as models from "../../models";
import { GET_RESOURCE_VERSIONS } from "./resourceVersionQueries";

type TGetResourceVersions = {
  resourceVersions: models.ResourceVersion[];
  _resourceVersionsMeta: { count: number };
};

const useResourceVersions = (resourceId: string | undefined) => {
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [orderBy, setOrderBy] =
    useState<models.ResourceVersionOrderByInput>(undefined);

  const {
    data: resourceVersions,
    loading: loadingResourceVersions,
    error: errorResourceVersions,
    refetch: reloadResourceVersions,
  } = useQuery<TGetResourceVersions>(GET_RESOURCE_VERSIONS, {
    variables: {
      orderBy: orderBy || { createdAt: models.SortOrder.Desc },
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
      where: {
        resource: { id: resourceId },
        message:
          searchPhrase !== ""
            ? { contains: searchPhrase, mode: models.QueryMode.Insensitive }
            : undefined,
      },
    },
    skip: !resourceId,
  });

  return {
    resourceVersions: resourceVersions?.resourceVersions || [],
    resourceVersionsCount: resourceVersions?._resourceVersionsMeta.count || 0,
    loadingResourceVersions,
    errorResourceVersions,
    reloadResourceVersions,
    setPageNumber,
    pageNumber,
    setPageSize,
    pageSize,
    setOrderBy,
    setSearchPhrase,
  };
};

export default useResourceVersions;
