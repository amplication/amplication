import { useQuery } from "@apollo/client";
import { useState } from "react";
import * as models from "../../models";
import { GET_OUTDATED_VERSION_ALERTS } from "./outdatedVersionAlertsQueries";

type TGetOutdatedVersionAlerts = {
  outdatedVersionAlerts: models.OutdatedVersionAlert[];
  _outdatedVersionAlertsMeta: { count: number };
};

const useOutdatedVersionAlerts = (projectId: string, resourceId?: string) => {
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(30);
  const [orderBy, setOrderBy] =
    useState<models.OutdatedVersionAlertOrderByInput>(undefined);

  const [outdatedVersionAlerts, setOutdatedVersionAlerts] = useState<
    models.OutdatedVersionAlert[]
  >([]);

  const [outdatedVersionAlertsCount, setOutdatedVersionAlertsCount] =
    useState<number>(0);

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
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
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
    onCompleted: (data) => {
      setOutdatedVersionAlerts(data.outdatedVersionAlerts);
      setOutdatedVersionAlertsCount(data._outdatedVersionAlertsMeta.count);
    },
  });

  return {
    outdatedVersionAlerts,
    outdatedVersionAlertsCount,
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
