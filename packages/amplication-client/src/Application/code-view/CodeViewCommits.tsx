import {
  EnumButtonStyle,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
} from "@amplication/design-system";
import { gql, useQuery } from "@apollo/client";
import React from "react";
import "./CodeViewBar.scss";
import * as models from "../../models";
import { CommitMenuItemContent } from "./CommitMenuItemContent";

const CLASS_NAME = "code-view-bar";
const CREATED_AT_FIELD = "createdAt";
type TData = {
  builds: models.Build[];
};

type Props = {
  application: string;
  selectedCommit: models.Build | null;
  onSelectCommit: (commit: models.Build) => void;
};

const CodeViewCommits = ({
  application,
  selectedCommit,
  onSelectCommit,
}: Props) => {
  const { data } = useQuery<TData>(GET_BUILDS_COMMIT, {
    variables: {
      appId: application,
      orderBy: {
        [CREATED_AT_FIELD]: models.SortOrder.Desc,
      },
    },
  });

  console.log(data);

  return (
    <div className={CLASS_NAME}>
      <div>
        <SelectMenu
          title={
            selectedCommit?.message ? (
              <CommitMenuItemContent commit={selectedCommit} />
            ) : (
              "select commit"
            )
          }
          buttonStyle={EnumButtonStyle.Clear}
          className={`${CLASS_NAME}__menu`}
          icon="chevron_down"
        >
          <SelectMenuModal>
            <SelectMenuList>
              <>
                {data?.builds.map((commit) => (
                  <SelectMenuItem
                    closeAfterSelectionChange
                    selected={commit.id === selectedCommit?.id}
                    key={commit.id}
                    onSelectionChange={() => {
                      onSelectCommit(commit);
                    }}
                    css={undefined}
                  >
                    <CommitMenuItemContent commit={commit} />
                  </SelectMenuItem>
                ))}
                <div className={`select-menu_item ${CLASS_NAME}__hr`}>
                  <hr />
                </div>
              </>
            </SelectMenuList>
          </SelectMenuModal>
        </SelectMenu>
      </div>
    </div>
  );
};

export default CodeViewCommits;

export const GET_BUILDS_COMMIT = gql`
  query builds(
    $appId: String!
    $orderBy: BuildOrderByInput
    $whereMessage: StringFilter
  ) {
    builds(
      where: { app: { id: $appId }, message: $whereMessage }
      orderBy: $orderBy
    ) {
      id
      message
      createdAt
      # builds(orderBy: { createdAt: Desc }, take: 1) {
      #   id
      #   createdAt
      #   appId
      #   version
      #   message
      #   createdAt
      #   commitId
      #   actionId
      #   action {
      #     id
      #     createdAt
      #     steps {
      #       id
      #       name
      #       createdAt
      #       message
      #       status
      #       completedAt
      #       logs {
      #         id
      #         createdAt
      #         message
      #         meta
      #         level
      #       }
      #     }
      #   }
      #   createdBy {
      #     id
      #     account {
      #       firstName
      #       lastName
      #     }
      #   }
      #   status
      #   archiveURI
      # }
    }
  }
`;
