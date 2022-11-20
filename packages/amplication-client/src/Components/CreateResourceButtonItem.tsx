import { SelectMenuItem } from "@amplication/design-system";
import { EnumResourceType } from "@amplication/prisma-db";
import React, { useCallback, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { AppContext } from "../context/appContext";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { CreateResourceButtonItemType } from "./CreateResourceButton";
import ResourceCircleBadge from "./ResourceCircleBadge";

type props = {
  item: CreateResourceButtonItemType;
};

const CreateResourceButtonItem = ({ item }: props) => {
  const { trackEvent } = useTracking();
  const history = useHistory();

  const { currentWorkspace, currentProject } = useContext(AppContext);

  const handleCreateResourceByType = {
    Service: () => {
      trackEvent({
        eventName: AnalyticsEventNames.CreateService,
      });
    },
    MessageBroker: () => {
      trackEvent({
        eventName: AnalyticsEventNames.CreateMessageBroker,
      });
    },
    ProjectConfiguration: () => {
      trackEvent({
        eventName: AnalyticsEventNames.CreateProjectConfiguration,
      });
    },
  };

  const handleClick = useCallback(() => {
    handleCreateResourceByType[item.type]();
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
    >
      <Link
        onClick={handleClick}
        to={`/${currentWorkspace?.id}/${currentProject?.id}/${item.route}`}
      >
        <ResourceCircleBadge type={item.type} size="xsmall" />
        {item.label}
      </Link>
    </SelectMenuItem>
  );
};

export default CreateResourceButtonItem;
