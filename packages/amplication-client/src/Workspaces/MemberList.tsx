import {
  CircularProgress,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  List,
  Snackbar,
  Text,
} from "@amplication/ui/design-system";
import { gql, useQuery } from "@apollo/client";
import { isEmpty } from "lodash";
import { useCallback, useState } from "react";
import { EmptyState } from "../Components/EmptyState";
import { EnumImages } from "../Components/SvgThemeImage";
import * as models from "../models";
import { formatError } from "../util/error";
import { pluralize } from "../util/pluralize";
import InviteMember from "./InviteMember";
import MemberListItem from "./MemberListItem";
import { AppRouteProps } from "../routes/routesUtil";
import { match } from "react-router-dom";

export type TData = {
  workspaceMembers: Array<models.WorkspaceMember>;
};

const CLASS_NAME = "member-list";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    user: string;
  }>;
};

function MemberList({ match, innerRoutes }: Props) {
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

  if (match.isExact) {
    return (
      <div className={CLASS_NAME}>
        <FlexItem end={<InviteMember />}>
          <Text textStyle={EnumTextStyle.H4}>Users</Text>
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

        <Snackbar
          open={Boolean(error || errorLoading)}
          message={errorMessage}
        />
      </div>
    );
  } else {
    return innerRoutes;
  }
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
