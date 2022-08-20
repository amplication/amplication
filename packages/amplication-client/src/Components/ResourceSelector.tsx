import {
  EnumButtonStyle,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  Label,
  formatTimeToNow,
  CircleBadge,
} from "@amplication/design-system";
import React from "react";
import { Resource } from "../models";
import { CommitSelectorItem } from "./CommitSelectorItem";
import "./CommitSelector.scss";

const CLASS_NAME = "commit-selector";

type Props = {
  resources: Resource[];
  selectedResource: Resource | null;
  onSelectResource: (resource: Resource) => void;
};

const ResourceSelector = ({
  resources,
  onSelectResource,
  selectedResource,
}: Props) => {
  const createdAtHour = selectedResource
    ? formatTimeToNow(new Date(selectedResource?.createdAt))
    : null;

  const createdHourStyle = () => (
    <label className={`${CLASS_NAME}__hour`}>{createdAtHour}</label>
  );

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__label-title`}>
        <Label text="Select resource" />
      </div>
      <SelectMenu
        title={
          <div className="commit-selector-item">
            <CircleBadge
              name={selectedResource?.name}
              color={selectedResource?.color}
            />
            <div className={"title"}>
              {selectedResource?.name}
              <div>{createdHourStyle()}</div>
            </div>
          </div>
        }
        buttonStyle={EnumButtonStyle.Secondary}
        className={`${CLASS_NAME}__menu`}
        icon="chevron_down"
      >
        <SelectMenuModal css={undefined}>
          <SelectMenuList style={{ width: "264px" }}>
            <>
              {resources.map((resource) => (
                <SelectMenuItem
                  closeAfterSelectionChange
                  selected={resource.id === selectedResource?.id}
                  key={resource.id}
                  onSelectionChange={() => {
                    onSelectResource(resource);
                  }}
                >
                  <CommitSelectorItem title={resource.name} type="list" />
                </SelectMenuItem>
              ))}
            </>
          </SelectMenuList>
        </SelectMenuModal>
      </SelectMenu>
    </div>
  );
};

export default ResourceSelector;
