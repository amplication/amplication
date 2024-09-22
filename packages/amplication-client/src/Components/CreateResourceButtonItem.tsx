import { SelectMenuItem } from "@amplication/ui/design-system";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import { CreateResourceButtonItemType } from "./CreateResourceButton";
import "./CreateResourceButtonItem.scss";
import ResourceCircleBadge from "./ResourceCircleBadge";

type props = {
  item: CreateResourceButtonItemType;
};

const CLASS_NAME = "create-resource-button-item";

const RESOURCE_TYPE_TO_EVENT_NAME = {
  Service: AnalyticsEventNames.CreateService,
  MessageBroker: AnalyticsEventNames.CreateMessageBroker,
  ProjectConfiguration: AnalyticsEventNames.CreateProjectConfiguration,
};

const CreateResourceButtonItem = ({ item }: props) => {
  const { trackEvent } = useTracking();

  const { baseUrl } = useProjectBaseUrl({ overrideIsPlatformConsole: false });

  const handleClick = useCallback(() => {
    trackEvent({
      eventName: RESOURCE_TYPE_TO_EVENT_NAME[item.type],
    });
  }, [trackEvent, item]);

  return (
    <SelectMenuItem closeAfterSelectionChange as="span">
      <Link
        onClick={handleClick}
        to={`${baseUrl}/${item.route}`}
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
