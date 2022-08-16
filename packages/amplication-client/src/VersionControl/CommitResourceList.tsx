import { gql, useQuery } from "@apollo/client";
import React from "react";
import { match } from "react-router-dom";
import { Build } from "../models";
import { AppRouteProps } from "../routes/routesUtil";
import CommitResourceListItem from "./CommitResourceListItem";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
    commit: string;
  }>;
};

const CommitResourceList: React.FC<Props> = ({ match }) => {
  const commitId = match.params.commit;
  const { data } = useQuery(GET_COMMIT_RESOURCES, {
    variables: {
      commitId: commitId,
    },
  });

  return (
    <div>
      {data?.commit.builds.map((build: Build) => (
        <CommitResourceListItem key={build.id} build={build} />
      ))}
    </div>
  );
};

export default CommitResourceList;

export const GET_COMMIT_RESOURCES = gql`
  query Commit($commitId: String!) {
    commit(where: { id: $commitId }) {
      id
      message
      createdAt
      builds(orderBy: { createdAt: Desc }, take: 1) {
        id
        createdAt
        resource {
          id
          name
          resourceType
        }
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
