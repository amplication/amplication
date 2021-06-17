import React, { useCallback } from "react";
import { gql, useQuery } from "@apollo/client";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import { CircularProgress } from "@rmwc/circular-progress";
import { formatError } from "../util/error";
import { useTracking } from "../util/analytics";

import { Button, EnumButtonStyle } from "../Components/Button";
import MemberListItem from "./MemberListItem";

import * as models from "../models";
import "./MemberList.scss";

type TData = {
  workspaceMembers: Array<models.WorkspaceMember>;
};

const CLASS_NAME = "member-list";

function MemberList() {
  const { trackEvent } = useTracking();

  const { data, error, loading } = useQuery<TData>(GET_WORKSPACE_MEMBERS);
  const errorMessage = formatError(error);

  const handleNewAppClick = useCallback(() => {
    trackEvent({
      eventName: "inviteUserClick",
    });
  }, [trackEvent]);

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__header`}>
        <h2>Workspace Members</h2>

        <Link onClick={handleNewAppClick} to="/create-app">
          <Button
            className={`${CLASS_NAME}__add-button`}
            buttonStyle={EnumButtonStyle.Primary}
            icon="plus"
          >
            Invite a member
          </Button>
        </Link>
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
