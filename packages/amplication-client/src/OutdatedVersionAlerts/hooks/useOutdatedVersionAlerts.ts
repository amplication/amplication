import { useQuery } from "@apollo/client";
import { useState } from "react";
import * as models from "../../models";
import { GET_OUTDATED_VERSION_ALERTS } from "./outdatedVersionAlertsQueries";

type TGetOutdatedVersionAlerts = {
  outdatedVersionAlerts: models.OutdatedVersionAlert[];
  _outdatedVersionAlertsMeta: { count: number };
};

const useOutdatedVersionAlerts = (projectId: string) => {
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(30);
  const [orderBy, setOrderBy] =
    useState<models.OutdatedVersionAlertOrderByInput>(undefined);

  const [status, setStatus] = useState<
    keyof typeof models.EnumOutdatedVersionAlertStatus | null
  >(models.EnumOutdatedVersionAlertStatus.New);

  const [type, setType] = useState<
    keyof typeof models.EnumOutdatedVersionAlertType | null
  >(null);

  const {
    data: outdatedVersionAlert,
    loading: loadingOutdatedVersionAlerts,
    error: errorOutdatedVersionAlerts,
    refetch: reloadOutdatedVersionAlerts,
  } = useQuery<TGetOutdatedVersionAlerts>(GET_OUTDATED_VERSION_ALERTS, {
    variables: {
      orderBy: orderBy || { createdAt: models.SortOrder.Desc },
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
      where: {
        resource: { project: { id: projectId } },
        status: status ? { equals: status } : undefined,
        type: type ? { equals: type } : undefined,
        // message:
        //   searchPhrase !== ""
        //     ? { contains: searchPhrase, mode: models.QueryMode.Insensitive }
        //     : undefined,
      },
    },
    skip: !projectId,
  });

  return {
    outdatedVersionAlerts: outdatedVersionAlert?.outdatedVersionAlerts || [],
    outdatedVersionAlertsCount:
      outdatedVersionAlert?._outdatedVersionAlertsMeta.count || 0,
    loadingOutdatedVersionAlerts,
    errorOutdatedVersionAlerts,
    reloadOutdatedVersionAlerts,
    setPageNumber,
    pageNumber,
    setPageSize,
    pageSize,
    setOrderBy,
    setSearchPhrase,
    status,
    setStatus,
    type,
    setType,
  };
};

export default useOutdatedVersionAlerts;
