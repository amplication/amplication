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
  selectedBuild: Build | null;
  app: App;
  onSelectBuild: (commit: Build) => void;
};

const BuildSelector = ({
  builds,
  app,
  onSelectBuild,
  selectedBuild,
}: Props) => {
  return (
    <div className={CLASS_NAME}>
      <div>
        <Label text="Select build" />
        <SelectMenu
          title={
            <BuildSelectorItem
              title={
                selectedBuild?.message
                  ? selectedBuild?.message
                  : selectedBuild?.createdAt
              }
              app={app}
            />
          }
          buttonStyle={EnumButtonStyle.Secondary}
          className={`${CLASS_NAME}__menu`}
          icon="chevron_down"
        >
          <SelectMenuModal css={undefined}>
            <SelectMenuList style={{ width: "264px" }}>
              <>
                {builds.map((build) => (
                  <SelectMenuItem
                    closeAfterSelectionChange
                    selected={build.id === selectedBuild?.id}
                    key={build.id}
                    onSelectionChange={() => {
                      onSelectBuild(build);
                    }}
                  >
                    <BuildSelectorItem
                      title={build.message ? build.message : build.createdAt}
                      app={app}
                      type="list"
                    />
                  </SelectMenuItem>
                ))}
              </>
            </SelectMenuList>
          </SelectMenuModal>
        </SelectMenu>
      </div>
    </div>
  );
};

export default BuildSelector;
