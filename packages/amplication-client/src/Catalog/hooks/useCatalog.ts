import { useQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import * as models from "../../models";

import { useAppContext } from "../../context/appContext";
import { SEARCH_CATALOG } from "../queries/catalogQueries";
import { useQueryPagination } from "../../util/useQueryPagination";

type CatalogResults = {
  catalog: models.PaginatedResourceQueryResult;
};

const DEFAULT_PROJECT_TYPE_FILTER: models.EnumResourceTypeFilter = {
  notIn: [
    models.EnumResourceType.ProjectConfiguration,
    models.EnumResourceType.PluginRepository,
    models.EnumResourceType.ServiceTemplate,
  ],
};

const RESOURCE_TYPE_PREFIX = "resourceType_";
const BLUEPRINT_PREFIX = "blueprint_";

type Props = {
  initialPageSize?: number;
};

const useCatalog = (props?: Props) => {
  const { initialPageSize } = props || {};

  const { customPropertiesMap } = useAppContext();

  const {
    pagination,
    queryPaginationParams,
    currentPageData,
    setCurrentPageData,
    setMeta,
    sorting,
  } = useQueryPagination<models.Resource, models.ResourceOrderByInput[]>({
    initialPageSize,
  });

  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [propertiesFilter, setPropertiesFilter] =
    useState<models.JsonPathStringFilter | null>(null);

  const [queryFilters, setQueryFilter] = useState<
    Partial<models.ResourceWhereInputWithPropertiesFilter>
  >({
    resourceType: DEFAULT_PROJECT_TYPE_FILTER,
  });

  const {
    data: catalogData,
    loading,
    error,
    refetch,
  } = useQuery<CatalogResults>(SEARCH_CATALOG, {
    variables: {
      ...queryPaginationParams,
      where: {
        ...queryFilters,
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
      setCurrentPageData(catalogData.catalog.data);
      setMeta({ count: catalogData.catalog.totalCount });
    }
  }, [catalogData, setCurrentPageData, setMeta]);

  const setFilter = useCallback(
    (filters: Record<string, string | string[]>) => {
      //split the filters into properties and other filters
      const [propertiesFilters, otherFilters] = Object.entries(filters).reduce(
        (acc, [key, value]) => {
          if (customPropertiesMap[key]) {
            acc[0][key] = value;
          } else {
            acc[1][key] = value;
          }
          return acc;
        },
        [
          {} as Record<string, string | string[]>,
          {} as Record<string, string | string[]>,
        ]
      );

      const filterList: models.JsonPathStringFilterItem[] = Object.keys(
        propertiesFilters
      ).map((key) => {
        if (!propertiesFilters[key]) {
          return null;
        }

        return {
          path: key,
          equals:
            customPropertiesMap[key].type ===
            models.EnumCustomPropertyType.Select
              ? (propertiesFilters[key] as string) // custom properties filters are always strings
              : undefined,
          arrayContains:
            customPropertiesMap[key].type ===
            models.EnumCustomPropertyType.MultiSelect
              ? (propertiesFilters[key] as string) // custom properties filters are always strings
              : undefined,
        };
      });

      const activeFilters = filterList.filter((filter) => filter !== null);

      if (activeFilters.length === 0) {
        setPropertiesFilter(null);
      } else {
        setPropertiesFilter({
          matchAll: activeFilters,
        });
      }

      const otherFilterObject = Object.entries(otherFilters).reduce(
        (acc, [key, value]) => {
          if (key === "resourceType" && value) {
            acc = {
              resourceType: {
                equals: value as models.EnumResourceType,
              },
            };
          } else if (key === "resourceTypeOrBlueprint" && value) {
            acc = updateResourceTypeFilter(acc, value as unknown as string[]);
          } else if (key === "ownership" && value) {
            const values = (value as string).split(":"); //ownership filter value is in the format of key:value
            if (values.length !== 2 || !values[0] || !values[1]) {
              return acc;
            }
            const filter: models.OwnershipWhereInput = {
              [values[0]]: values[1],
            };
            acc[key] = filter;
          } else if (value) {
            acc[key] = Array.isArray(value) ? { in: value } : value;
          }
          return acc;
        },
        {}
      );

      if (!otherFilterObject.hasOwnProperty("resourceType")) {
        otherFilterObject["resourceType"] = DEFAULT_PROJECT_TYPE_FILTER;
      }

      setQueryFilter(otherFilterObject);
    },
    [customPropertiesMap]
  );

  const reloadCatalog = useCallback(() => {
    pagination.setPageNumber(1);
    refetch();
  }, [pagination, refetch]);

  return {
    catalog: currentPageData || [],
    loading,
    error,
    setSearchPhrase,
    setFilter,
    pagination,
    sorting,
    reloadCatalog,
  };
};

export default useCatalog;

const updateResourceTypeFilter = (
  currentFilter: Partial<models.ResourceWhereInputWithPropertiesFilter>,
  value: string[]
) => {
  const [blueprintValues, resourceTypeValues] = value.reduce(
    (acc, value) => {
      if (value.startsWith(BLUEPRINT_PREFIX)) {
        acc[0].push(value.replace(BLUEPRINT_PREFIX, ""));
      } else {
        acc[1].push(value.replace(RESOURCE_TYPE_PREFIX, ""));
      }
      return acc;
    },
    [[], []] as [string[], string[]]
  );

  return {
    ...currentFilter,
    resourceType:
      resourceTypeValues.length > 0
        ? {
            in: resourceTypeValues as models.EnumResourceType[],
          }
        : undefined,
    blueprintId:
      blueprintValues.length > 0 ? { in: blueprintValues } : undefined,
  };
};
