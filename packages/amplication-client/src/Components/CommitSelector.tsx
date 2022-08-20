import {
  EnumButtonStyle,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  Label,
} from "@amplication/design-system";
import React from "react";
import { Commit } from "../models";
import { CommitSelectorItem } from "./CommitSelectorItem";
import "./CommitSelector.scss";

const CLASS_NAME = "commit-selector";

type Props = {
  commits: Commit[];
  selectedCommit: Commit | null;
  onSelectCommit: (commit: Commit) => void;
};

const CommitSelector = ({ commits, onSelectCommit, selectedCommit }: Props) => {
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__label-title`}>
        <Label text="Select commit" />
      </div>
      <SelectMenu
        title={
          <CommitSelectorItem
            title={
              selectedCommit?.message
                ? selectedCommit?.message
                : selectedCommit?.createdAt
            }
          />
        }
        buttonStyle={EnumButtonStyle.Secondary}
        className={`${CLASS_NAME}__menu`}
        icon="chevron_down"
      >
        <SelectMenuModal css={undefined}>
          <SelectMenuList style={{ width: "264px" }}>
            <>
              {commits.map((commit) => (
                <SelectMenuItem
                  closeAfterSelectionChange
                  selected={commit.id === selectedCommit?.id}
                  key={commit.id}
                  onSelectionChange={() => {
                    onSelectCommit(commit);
                  }}
                >
                  <CommitSelectorItem
                    title={commit.message ? commit.message : commit.createdAt}
                    type="list"
                  />
                </SelectMenuItem>
              ))}
            </>
          </SelectMenuList>
        </SelectMenuModal>
      </SelectMenu>
    </div>
  );
};

export default CommitSelector;
