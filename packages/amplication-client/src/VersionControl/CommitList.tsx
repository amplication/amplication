import React, { useState, useEffect } from "react";
import { match } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Snackbar } from "@rmwc/snackbar";

import { formatError } from "../util/error";
import * as models from "../models";
import {
  DataGrid,
  DataField,
  EnumTitleType,
  SortData,
} from "@amplication/design-system";

import { CommitListItem } from "./CommitListItem";
import PageContent from "../Layout/PageContent";

import { Button, EnumButtonStyle } from "../Components/Button";

const fields: DataField[] = [
  {
    name: "id",
    title: "ID",
  },
  {
    name: "createdAt",
    title: "Created",
    sortable: true,
  },
  {
    name: "message",
    title: "Commit Message",
    sortable: true,
  },
  {
    name: "buildId",
    title: "Build ID",
  },
  {
    name: "generated",
    title: "",
    icon: "code1",
    minWidth: true,
  },
  {
    name: "container",
    title: "",
    icon: "docker",
    minWidth: true,
  },
];

type TData = {
  commits: models.Commit[];
};

type Props = {
  match: match<{ application: string }>;
};

const CREATED_AT_FIELD = "createdAt";

const INITIAL_SORT_DATA = {
  field: CREATED_AT_FIELD,
  order: 1,
};
const POLL_INTERVAL = 10000;

export const CommitList = ({ match }: Props) => {
  const { application } = match.params;
  const [sortDir, setSortDir] = useState<SortData>(INITIAL_SORT_DATA);

  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const handleSortChange = (sortData: SortData) => {
    setSortDir(sortData);
  };

  const handleSearchChange = (value: string) => {
    setSearchPhrase(value);
  };

  const { data, loading, error, refetch, stopPolling, startPolling } = useQuery<
    TData
  >(GET_COMMITS, {
    variables: {
      appId: application,
      orderBy: {
        [sortDir.field || CREATED_AT_FIELD]:
          sortDir.order === 1 ? models.SortOrder.Desc : models.SortOrder.Asc,
      },
      whereMessage:
        searchPhrase !== ""
          ? { contains: searchPhrase, mode: models.QueryMode.Insensitive }
          : undefined,
    },
  });

  //start polling with cleanup
  useEffect(() => {
    refetch().catch(console.error);
    startPolling(POLL_INTERVAL);
    return () => {
      stopPolling();
    };
  }, [refetch, stopPolling, startPolling]);

  const errorMessage = formatError(error);

  return (
    <PageContent className="pages">
      <DataGrid
        showSearch
        fields={fields}
        title="Commits"
        titleType={EnumTitleType.PageTitle}
        loading={loading}
        sortDir={sortDir}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
        toolbarContentEnd={
          <Button buttonStyle={EnumButtonStyle.Primary} onClick={() => {}}>
            Create New
          </Button>
        }
      >
        {data?.commits.map((commit) => (
          <CommitListItem
            key={commit.id}
            commit={commit}
            applicationId={application}
          />
        ))}
      </DataGrid>

      <Snackbar open={Boolean(error)} message={errorMessage} />
    </PageContent>
  );
};

/**@todo: expand search on other field  */
export const GET_COMMITS = gql`
  query commits(
    $appId: String!
    $orderBy: CommitOrderByInput
    $whereMessage: StringFilter
  ) {
    commits(
      where: { app: { id: $appId }, message: $whereMessage }
      orderBy: $orderBy
    ) {
      id
      message
      createdAt
      user {
        id
        account {
          firstName
          lastName
        }
      }
      builds(orderBy: { createdAt: Desc }, take: 1) {
        id
        createdAt
        appId
        version
        message
        createdAt
        commitId
        actionId
        action {
          id
          createdAt
          steps {
            id
            name
            createdAt
            message
            status
            completedAt
            logs {
              id
              createdAt
              message
              meta
              level
            }
          }
        }
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
  }
`;
