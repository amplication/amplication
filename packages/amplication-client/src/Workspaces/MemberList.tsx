import { gql, useQuery } from "@apollo/client";
import {
  CircularProgress,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  List,
  Snackbar,
  Text,
} from "@amplication/ui/design-system";
import { isEmpty } from "lodash";
import React, { useCallback, useState } from "react";
import * as models from "../models";
import { formatError } from "../util/error";
import InviteMember from "./InviteMember";
import MemberListItem from "./MemberListItem";
import { pluralize } from "../util/pluralize";
import PageContent from "../Layout/PageContent";
import { EmptyState } from "../Components/EmptyState";
import { EnumImages } from "../Components/SvgThemeImage";

export type TData = {
  workspaceMembers: Array<models.WorkspaceMember>;
};

const CLASS_NAME = "member-list";
const PAGE_TITLE = "Members";

function MemberList() {
  const [error, setError] = useState<Error>();
  const {
    data,
    error: errorLoading,
    loading,
    refetch,
  } = useQuery<TData>(GET_WORKSPACE_MEMBERS);
  const errorMessage =
    formatError(errorLoading) || (error && formatError(error));

  const handleDelete = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <PageContent className={CLASS_NAME} pageTitle={PAGE_TITLE}>
      <FlexItem end={<InviteMember />}>
        <Text textStyle={EnumTextStyle.H4}>Workspace Members</Text>
      </FlexItem>

      <HorizontalRule />

      <Text textStyle={EnumTextStyle.Tag}>
        {data?.workspaceMembers.length}{" "}
        {pluralize(data?.workspaceMembers.length, "Member", "Members")}
      </Text>

      {loading && <CircularProgress centerToParent />}

      {isEmpty(data?.workspaceMembers) && !loading ? (
        <EmptyState
          image={EnumImages.CommitEmptyState}
          message="There are no members to show"
        />
      ) : (
        <List>
          {data?.workspaceMembers.map((member, index) => (
            <MemberListItem
              member={member}
              key={index}
              onDelete={handleDelete}
              onError={setError}
            />
          ))}
        </List>
      )}

      <Snackbar open={Boolean(error || errorLoading)} message={errorMessage} />
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
