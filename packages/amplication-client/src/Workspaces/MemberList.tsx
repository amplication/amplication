import { gql, useQuery } from "@apollo/client";
import { CircularProgress, Snackbar } from "@amplication/design-system";
import { isEmpty } from "lodash";
import React, { useCallback, useState } from "react";
import * as models from "../models";
import { formatError } from "../util/error";
import InviteMember from "./InviteMember";
import "./MemberList.scss";
import MemberListItem from "./MemberListItem";
import PageContent from "../Layout/PageContent";
import ProjectSideBar from "../Project/ProjectSideBar";

type TData = {
  workspaceMembers: Array<models.WorkspaceMember>;
};

const CLASS_NAME = "member-list";

function MemberList() {
  const [error, setError] = useState<Error>();
  const { data, error: errorLoading, loading, refetch } = useQuery<TData>(
    GET_WORKSPACE_MEMBERS
  );
  const errorMessage =
    formatError(errorLoading) || (error && formatError(error));

  const handleDelete = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <PageContent pageTitle="workspace members" sideContent={ <ProjectSideBar />}>
      <div className={CLASS_NAME}>
        <div className={`${CLASS_NAME}__header`}>
          <h2>Workspace Members</h2>

          <InviteMember />
        </div>
        <div className={`${CLASS_NAME}__title`}>
          {data?.workspaceMembers.length} Members
        </div>
        {loading && <CircularProgress />}

        {isEmpty(data?.workspaceMembers) && !loading ? (
          <div className={`${CLASS_NAME}__empty-state`}>
            <div className={`${CLASS_NAME}__empty-state__title`}>
              There are no members to show
            </div>
          </div>
        ) : (
          data?.workspaceMembers.map((member, index) => (
            <MemberListItem
              member={member}
              key={index}
              onDelete={handleDelete}
              onError={setError}
            />
          ))
        )}

        <Snackbar
          open={Boolean(error || errorLoading)}
          message={errorMessage}
        />
      </div>
    </PageContent>
  );
}

export default MemberList;

export const GET_WORKSPACE_MEMBERS = gql`
  query workspaceMembers {
    workspaceMembers {
      type
      member {
        __typename
        ... on User {
          id
          isOwner
          account {
            id
            email
            firstName
            lastName
          }
        }
        ... on Invitation {
          id
          email
        }
      }
    }
  }
`;
