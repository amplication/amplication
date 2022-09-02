import {
  EnumButtonStyle,
  SelectMenu,
  SelectMenuList,
  SelectMenuModal,
} from "@amplication/design-system";
import React from "react";
import * as models from "../models";
import "./CreateResourceButton.scss";
import CreateResourceButtonItem from "./CreateResourceButtonItem";

const CLASS_NAME = "create-resource-button";

export type CreateResourceButtonItemType = {
  type: models.EnumResourceType;
  label: string;
  route: string;
};

const ITEMS: CreateResourceButtonItemType[] = [
  {
    type: models.EnumResourceType.Service,
    label: "Service",
    route: "create-resource",
  },
  {
    type: models.EnumResourceType.MessageBroker,
    label: "Message Broker",
    route: "create-broker",
  },
];

const CreateResourceButton = () => {
  return (
    <div className={CLASS_NAME}>
      <SelectMenu
        title="Add Resource"
        buttonStyle={EnumButtonStyle.Primary}
        icon="plus"
      >
        <SelectMenuModal>
          <SelectMenuList>
            {ITEMS.map((item, index) => (
              <CreateResourceButtonItem item={item} key={index} />
            ))}
          </SelectMenuList>
        </SelectMenuModal>
      </SelectMenu>
    </div>
  );
};

export default CreateResourceButton;
