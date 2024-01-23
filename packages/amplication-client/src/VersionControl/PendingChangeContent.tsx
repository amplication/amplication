import {
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  Text,
  Tooltip,
} from "@amplication/ui/design-system";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { FlexStart } from "@amplication/ui/design-system/components/FlexItem/FlexItem";

type Props = {
  change: models.PendingChange;
  name: string;
  relativeUrl: string;
  linkToOrigin: boolean;
  icon: string;
  type: string;
};

const CLASS_NAME = "pending-change-content";

const PendingChangeContent = ({
  change,
  name,
  relativeUrl,
  linkToOrigin,
  icon,
  type,
}: Props) => {
  const { currentWorkspace, currentProject } = useContext(AppContext);

  const isProjectConfigResourceType =
    change.resource.resourceType ===
    models.EnumResourceType.ProjectConfiguration;

  const url = isProjectConfigResourceType
    ? `/${currentWorkspace?.id}/${currentProject?.id}/settings/general`
    : `/${currentWorkspace?.id}/${currentProject?.id}/${change.resource.id}/${relativeUrl}`;

  const nameElement = (
    <FlexItem itemsAlign={EnumItemsAlign.Center} className={CLASS_NAME}>
      <FlexStart className={`${CLASS_NAME}__indicator-wrapper`}>
        <Icon
          className={`${CLASS_NAME}__indicator ${CLASS_NAME}__indicator--${change.action}`}
          icon={icon}
        />
      </FlexStart>

      <Tooltip
        wrap
        direction={"nw"}
        aria-label={`${change.action}: ${name} `}
        className={`${CLASS_NAME}__tooltip_deleted`}
      >
        <Text
          textStyle={EnumTextStyle.Tag}
          textColor={EnumTextColor.White}
          className={`${CLASS_NAME}__name`}
        >
          {name}
        </Text>
      </Tooltip>
    </FlexItem>
  );

  return linkToOrigin &&
    change.action !== models.EnumPendingChangeAction.Delete ? (
    <Link className={`${CLASS_NAME}__link`} to={url}>
      {nameElement}
    </Link>
  ) : (
    <span className={`${CLASS_NAME}__link`}>{nameElement}</span>
  );
};
export default PendingChangeContent;
