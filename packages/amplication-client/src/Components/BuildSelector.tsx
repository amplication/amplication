import {
  EnumButtonStyle,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  Label,
} from "@amplication/design-system";
import React from "react";
import { Resource, Build } from "../models";
import { BuildSelectorItem } from "./BuildSelectorItem";
import "./BuildSelector.scss";

const CLASS_NAME = "build-selector";

type Props = {
  builds: Build[];
  selectedBuild: Build | null;
  resource: Resource;
  onSelectBuild: (commit: Build) => void;
};

const BuildSelector = ({
  builds,
  resource,
  onSelectBuild,
  selectedBuild,
}: Props) => {
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__label-title`}>
        <Label text="Select build" />
      </div>
      <SelectMenu
        title={
          <BuildSelectorItem
            title={
              selectedBuild?.message
                ? selectedBuild?.message
                : selectedBuild?.createdAt
            }
            resource={resource}
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
                    resource={resource}
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

export default BuildSelector;
