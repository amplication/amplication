import { useQuery } from "@apollo/client";
import { useCallback, useState } from "react";
import * as models from "../../models";
import { GET_RESOURCE_VERSIONS } from "./resourceVersionQueries";

type TGetResourceVersions = {
  resourceVersions: models.Resource[];
};

const useResourceVersion = (resourceId: string | undefined) => {
  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const {
    data: resourceVersions,
    loading: loadingResourceVersions,
    error: errorResourceVersions,
    refetch: reloadResourceVersions,
  } = useQuery<TGetResourceVersions>(GET_RESOURCE_VERSIONS, {
    variables: {
      resourceId: resourceId,
      whereName:
        searchPhrase !== ""
          ? { contains: searchPhrase, mode: models.QueryMode.Insensitive }
          : undefined,
    },
    skip: !resourceId,
  });

  const handleSearchChange = useCallback(
    (value) => {
      setSearchPhrase(value);
    },
    [setSearchPhrase]
  );

  return {
    resourceVersions: resourceVersions?.resourceVersions || [],
    handleSearchChange,
    loadingResourceVersions,
    errorResourceVersions,
    reloadResourceVersions,
  };
};

export default useResourceVersion;
