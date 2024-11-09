import { useLazyQuery, useQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import * as models from "../../models";

import { SEARCH_CATALOG } from "../queries/catalogQueries";

const useCatalog = () => {
  const [catalog, setCatalog] = useState<models.Resource[]>([]);

  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [propertiesFilter, setPropertiesFilter] =
    useState<models.JsonPathStringFilter | null>(null);

  const [projectId, setProjectId] = useState<string | null>(null);

  const {
    data: catalogData,
    loading,
    error,
  } = useQuery<{
    catalog: models.Resource[];
  }>(SEARCH_CATALOG, {
    variables: {
      where: {
        projectId: projectId ?? undefined,
        properties: propertiesFilter ?? undefined,
        name:
          searchPhrase !== ""
            ? { contains: searchPhrase, mode: models.QueryMode.Insensitive }
            : undefined,
      } as models.ResourceWhereInputWithPropertiesFilter,
    },
  });

  useEffect(() => {
    if (catalogData) {
      setCatalog(catalogData.catalog);
    }
  }, [catalogData]);

  return {
    catalog: catalog || [],
    loading,
    error,
    setSearchPhrase,
    setPropertiesFilter,
  };
};

export default useCatalog;
