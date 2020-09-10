import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { match } from "react-router-dom";
import download from "downloadjs";
import { DataTableCell } from "@rmwc/data-table";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import { formatDistanceToNow } from "date-fns";

import DataGridRow from "../Components/DataGridRow";

import UserAvatar from "../Components/UserAvatar";
import PageContent from "../Layout/PageContent";
import FloatingToolbar from "../Layout/FloatingToolbar";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import { formatError } from "../util/error";
import {
  DataGrid,
  DataField,
  EnumTitleType,
  sortData,
  SortOrder,
} from "../Components/DataGrid";
import useBreadcrumbs from "../Layout/use-breadcrumbs";

type Props = {
  match: match<{ application: string }>;
};

const VERSION_FIELD = "createdAt";

const INITIAL_SORT_DATA: sortData = {
  field: VERSION_FIELD,
  order: SortOrder.Desc,
};

const POLL_INTERVAL = 2000;

const fields: DataField[] = [
  {
    name: "versionNumber",
    title: "Version No.",
    minWidth: true,
  },
  {
    name: "status",
    title: "Status",
  },
  {
    name: "description",
    title: "Description",
    sortable: true,
  },
  {
    name: "createdAt",
    title: "Build At",
    sortable: true,
  },
  {
    name: "commands",
    title: "",
    minWidth: true,
  },
];

const Builds = ({ match }: Props) => {
  const { application } = match.params;
  useBreadcrumbs(match.url, "Publish");

  const [sortDir, setSortDir] = useState<sortData>(INITIAL_SORT_DATA);
  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const handleSortChange = (fieldName: string, order: SortOrder | null) => {
    setSortDir({
      field: fieldName,
      order: order === null ? SortOrder.Desc : order,
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchPhrase(value);
  };

  const [error, setError] = useState<Error>();
  const { data, loading, refetch, stopPolling, startPolling } = useQuery<{
    builds: models.Build[];
  }>(GET_BUILDS, {
    variables: {
      appId: application,
      orderBy: {
        [sortDir.field || VERSION_FIELD]:
          sortDir.order === 1 ? models.SortOrder.Desc : models.SortOrder.Asc,
      },
      whereName:
        searchPhrase !== ""
          ? { contains: searchPhrase, mode: models.QueryMode.Insensitive }
          : undefined,
    },
  });

  //start polling with cleanup
  useEffect(() => {
    refetch();
    startPolling(POLL_INTERVAL);
    return () => {
      stopPolling();
    };
  }, [refetch, stopPolling, startPolling]);

  /** @todo update cache */
  const [createBuild] = useMutation<{
    createBuild: models.Build;
  }>(CREATE_BUILD, {
    variables: { appId: application },
    refetchQueries: [
      {
        query: GET_BUILDS,
        variables: {
          appId: application,
        },
      },
    ],
  });
  const handleBuildButtonClick = useCallback(() => {
    createBuild();
  }, [createBuild]);
  const errorMessage = error && formatError(error);
  return (
    <PageContent className="entity" withFloatingBar>
      <main>
        <FloatingToolbar />

        <DataGrid
          fields={fields}
          title="Builds"
          titleType={EnumTitleType.PageTitle}
          loading={loading}
          sortDir={sortDir}
          onSortChange={handleSortChange}
          onSearchChange={handleSearchChange}
          toolbarContentEnd={
            <Button onClick={handleBuildButtonClick}>Build</Button>
          }
        >
          {data?.builds.map((build) => {
            return <Build key={build.id} build={build} onError={setError} />;
          })}
        </DataGrid>

        <Snackbar open={Boolean(error)} message={errorMessage} />
      </main>
    </PageContent>
  );
};

export default Builds;

const Build = ({
  build,
  onError,
}: {
  build: models.Build;
  onError: (error: Error) => void;
}) => {
  const handleDownloadClick = useCallback(() => {
    downloadArchive(build.archiveURI).catch(onError);
  }, [build.archiveURI, onError]);

  const BuildAt = useMemo(() => {
    /**@todo: update the value even when the data was not changed to reflect the correct distance from now */
    return (
      build.createdAt &&
      formatDistanceToNow(new Date(build.createdAt), {
        addSuffix: true,
      })
    );
  }, [build.createdAt]);

  return (
    <DataGridRow>
      <DataTableCell>1.2.4</DataTableCell>
      <DataTableCell>{build.status}</DataTableCell>

      <DataTableCell>description</DataTableCell>
      <DataTableCell>
        <UserAvatar
          firstName={build.createdBy.account?.firstName}
          lastName={build.createdBy.account?.lastName}
        />

        <span className="text-muted space-before">{BuildAt}</span>
      </DataTableCell>
      <DataTableCell>
        <Button
          buttonStyle={EnumButtonStyle.Clear}
          icon="download"
          disabled={build.status !== models.EnumBuildStatus.Completed}
          onClick={handleDownloadClick}
        />
      </DataTableCell>
    </DataGridRow>
  );
};

const GET_BUILDS = gql`
  query($appId: String!, $orderBy: BuildOrderByInput) {
    builds(where: { app: { id: $appId } }, orderBy: $orderBy) {
      id
      createdAt
      createdBy {
        id
        account {
          firstName
          lastName
        }
      }
      status
      archiveURI
    }
  }
`;

const CREATE_BUILD = gql`
  mutation($appId: String!) {
    createBuild(data: { app: { connect: { id: $appId } } }) {
      id
      createdAt
      createdBy {
        id
      }
      status
    }
  }
`;

async function downloadArchive(uri: string): Promise<void> {
  const res = await fetch(uri);
  const url = new URL(res.url);
  switch (res.status) {
    case 200: {
      const blob = await res.blob();
      download(blob, url.pathname);
      break;
    }
    case 404: {
      throw new Error("File not found");
    }
    default: {
      throw new Error(await res.text());
    }
  }
}
