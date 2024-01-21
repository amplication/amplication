import { Icon, SelectMenuItem } from "@amplication/ui/design-system";
import "./RedesignResourceButtonItem.scss";
import { Resource } from "../models";

type props = {
  resource: Resource;
  onSelectResource: (resource: Resource) => void;
};

const CLASS_NAME = "redesign-resource-button-item";

const RedesignResourceButtonItem = ({ resource, onSelectResource }: props) => {
  return (
    <>
      <SelectMenuItem
        closeAfterSelectionChange
        itemData={resource}
        onSelectionChange={onSelectResource}
        as="span"
      >
        <div className={`${CLASS_NAME}__item`}>
          <Icon
            icon={"app-settings"}
            size="xsmall"
            className={`${CLASS_NAME}__icon`}
          ></Icon>
          <span>{resource.name}</span>
          <Icon
            className={`${CLASS_NAME}__serviceIcon`}
            icon={"app-settings"}
            size="xsmall"
          ></Icon>
        </div>
      </SelectMenuItem>
    </>
  );
};

export default RedesignResourceButtonItem;
