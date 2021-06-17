import { gql, useQuery } from "@apollo/client";
import { CircularProgress } from "@rmwc/circular-progress";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import { isEmpty } from "lodash";
import React from "react";
import * as models from "../models";
import { formatError } from "../util/error";
import InviteMember from "./InviteMember";
import "./MemberList.scss";
import MemberListItem from "./MemberListItem";

type TData = {
  workspaceMembers: Array<models.WorkspaceMember>;
};

const CLASS_NAME = "member-list";

function MemberList() {
  const { data, error, loading } = useQuery<TData>(GET_WORKSPACE_MEMBERS);
  const errorMessage = formatError(error);

  return (
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
          <MemberListItem member={member} key={index} />
        ))
      )}

      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
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
