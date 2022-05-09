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
  selectedBuild: models.Build | null;
  onSelectBuild: (commit: models.Build) => void;
};

const CodeViewCommits = ({
  application,
  selectedBuild,
  onSelectBuild,
}: Props) => {
  const { data } = useQuery<TData>(GET_BUILDS_COMMIT, {
    variables: {
      appId: application,
      orderBy: {
        [CREATED_AT_FIELD]: models.SortOrder.Desc,
      },
    },
  });

  return (
    <div className={CLASS_NAME}>
      <div>
        <SelectMenu
          title={
            selectedBuild?.message ? (
              <CommitMenuItemContent commit={selectedBuild} />
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
                {data?.builds.map((build) => (
                  <SelectMenuItem
                    closeAfterSelectionChange
                    selected={build.id === selectedBuild?.id}
                    key={build.id}
                    onSelectionChange={() => {
                      onSelectBuild(build);
                    }}
                    css={undefined}
                  >
                    <CommitMenuItemContent commit={build} />
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
    }
  }
`;
