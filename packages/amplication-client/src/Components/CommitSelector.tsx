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
import CommitData from "../VersionControl/CommitData";

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
        title={<CommitSelectorItem commit={selectedCommit} />}
        buttonStyle={EnumButtonStyle.Secondary}
        className={`${CLASS_NAME}__menu`}
        icon="chevron_down"
      >
        <SelectMenuModal>
          <SelectMenuList>
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
                  <CommitData commit={commit} />
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
