import { useQuery } from "@apollo/client";
import { useState } from "react";
import * as models from "../../models";
import { GET_OUTDATED_VERSION_ALERTS } from "./outdatedVersionAlertsQueries";
import { useQueryPagination } from "../../util/useQueryPagination";

type TGetOutdatedVersionAlerts = {
  outdatedVersionAlerts: models.OutdatedVersionAlert[];
  _outdatedVersionAlertsMeta: { count: number };
};

const useOutdatedVersionAlerts = (projectId: string, resourceId?: string) => {
  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const [orderBy, setOrderBy] =
    useState<models.OutdatedVersionAlertOrderByInput>(undefined);

  const {
    pagination,
    queryPaginationParams,
    currentPageData,
    setCurrentPageData,
    setMeta,
  } = useQueryPagination<models.OutdatedVersionAlert>();

  const [status, setStatus] = useState<
    keyof typeof models.EnumOutdatedVersionAlertStatus | null
  >(models.EnumOutdatedVersionAlertStatus.New);

  const [type, setType] = useState<
    keyof typeof models.EnumOutdatedVersionAlertType | null
  >(null);

  const {
    loading: loadingOutdatedVersionAlerts,
    error: errorOutdatedVersionAlerts,
    refetch: reloadOutdatedVersionAlerts,
  } = useQuery<TGetOutdatedVersionAlerts>(GET_OUTDATED_VERSION_ALERTS, {
    variables: {
      orderBy: orderBy || { createdAt: models.SortOrder.Desc },
      ...queryPaginationParams,
      where: {
        resource: {
          id: resourceId ?? undefined,
          project: { id: projectId },
        },
        status: status ? { equals: status } : undefined,
        type: type ? { equals: type } : undefined,
        // message:
        //   searchPhrase !== ""
        //     ? { contains: searchPhrase, mode: models.QueryMode.Insensitive }
        //     : undefined,
      },
    },
    skip: !projectId,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setCurrentPageData(data.outdatedVersionAlerts);
      setMeta(data._outdatedVersionAlertsMeta);
    },
  });

  return {
    outdatedVersionAlerts: currentPageData,
    loadingOutdatedVersionAlerts,
    errorOutdatedVersionAlerts,
    reloadOutdatedVersionAlerts,
    pagination,
    setOrderBy,
    setSearchPhrase,
    status,
    setStatus,
    type,
    setType,
  };
};

export default useOutdatedVersionAlerts;
