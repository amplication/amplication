import {
  EnumButtonStyle,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
} from "@amplication/design-system";
import { useQuery } from "@apollo/client";
import React from "react";
import "./CodeViewBar.scss";
import * as models from "../../models";
import { GET_COMMITS } from "../../VersionControl/CommitList";
import { CommitMenuItemContent } from "./CommitMenuItemContent";

const CLASS_NAME = "code-view-bar";
const CREATED_AT_FIELD = "createdAt";
type TData = {
  commits: models.Commit[];
};

type Props = {
  application: string;
  selectedCommit: models.Commit | null;
  onSelectCommit: (commit: models.Commit) => void;
};

const CodeViewCommits = ({
  application,
  selectedCommit,
  onSelectCommit,
}: Props) => {
  const { data } = useQuery<TData>(GET_COMMITS, {
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
                {data?.commits.map((commit) => (
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
