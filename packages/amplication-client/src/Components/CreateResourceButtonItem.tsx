import { SelectMenuItem } from "@amplication/ui/design-system";
import React, { useCallback, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { AppContext } from "../context/appContext";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { CreateResourceButtonItemType } from "./CreateResourceButton";
import ResourceCircleBadge from "./ResourceCircleBadge";
import "./CreateResourceButtonItem.scss";

type props = {
  item: CreateResourceButtonItemType;
};

const CLASS_NAME = "create-resource-button-item";

const CreateResourceButtonItem = ({ item }: props) => {
  const { trackEvent } = useTracking();
  const history = useHistory();

  const { currentWorkspace, currentProject } = useContext(AppContext);

  const RESOURCE_TYPE_TO_EVENT_NAME = {
    Service: AnalyticsEventNames.CreateService,
    MessageBroker: AnalyticsEventNames.CreateMessageBroker,
    ProjectConfiguration: AnalyticsEventNames.CreateProjectConfiguration,
  };

  const handleClick = useCallback(() => {
    trackEvent({
      eventName: RESOURCE_TYPE_TO_EVENT_NAME[item.type],
    });
  }, [trackEvent, item]);

  const handleSelectItem = useCallback(() => {
    history.push(
      `/${currentWorkspace?.id}/${currentProject?.id}/${item.route}`
    );
  }, [history, currentWorkspace, currentProject, item]);

  return (
    <SelectMenuItem
      closeAfterSelectionChange
      onSelectionChange={handleSelectItem}
      as="span"
    >
      <Link
        onClick={handleClick}
        to={`/${currentWorkspace?.id}/${currentProject?.id}/${item.route}`}
        className={CLASS_NAME}
      >
        <ResourceCircleBadge type={item.type} size="medium" />
        <span>{item.label}</span>
        <span>{item.info}</span>
      </Link>
    </SelectMenuItem>
  );
};

export default CreateResourceButtonItem;
