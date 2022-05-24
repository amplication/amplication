import {
  EnumButtonStyle,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
} from "@amplication/design-system";
import React from "react";
import { Build } from "../../models";
import "./CodeViewBar.scss";
import { CommitMenuItemContent } from "./CommitMenuItemContent";

const CLASS_NAME = "code-view-bar";

type Props = {
  builds: Build[];
  onSelectBuild: (commit: Build) => void;
  buildId: string | undefined;
  buildTitle: string;
};

const CodeViewCommits = ({
  builds,
  onSelectBuild,
  buildId,
  buildTitle,
}: Props) => {
  return (
    <div className={CLASS_NAME}>
      <div>
        {/*@ts-ignore*/}
        <SelectMenu
          title={
            buildId ? (
              <CommitMenuItemContent title={buildTitle} />
            ) : (
              "select commit"
            )
          }
          buttonStyle={EnumButtonStyle.Text}
          className={`${CLASS_NAME}__menu`}
          icon="chevron_down"
        >
          <SelectMenuModal>
            <SelectMenuList>
              <>
                {builds.map((build) => (
                  <SelectMenuItem
                    closeAfterSelectionChange
                    selected={build.id === buildId}
                    key={build.id}
                    onSelectionChange={() => {
                      onSelectBuild(build);
                    }}
                    css={undefined}
                  >
                    <CommitMenuItemContent
                      title={build.message ? build.message : build.createdAt}
                    />
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
