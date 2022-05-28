import {
  EnumButtonStyle,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  Label,
} from "@amplication/design-system";
import React from "react";
import { App, Build } from "../models";
import { BuildSelectorItem } from "./BuildSelectorItem";
import "./BuildSelector.scss";

const CLASS_NAME = "build-selector";

type Props = {
  builds: Build[];
  app: App;
  onSelectBuild: (commit: Build) => void;
  buildId: string | undefined;
  buildTitle: string;
};

const BuildSelector = ({
  builds,
  app,
  onSelectBuild,
  buildId,
  buildTitle,
}: Props) => {
  return (
    <div className={CLASS_NAME}>
      <div>
        <Label text="Select build" />
        <SelectMenu
          title={buildTitle}
          buttonStyle={EnumButtonStyle.Secondary}
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
                    <BuildSelectorItem
                      title={build.message ? build.message : build.createdAt}
                      app={app}
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

export default BuildSelector;
